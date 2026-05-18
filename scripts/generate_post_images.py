"""Generate hero (and optionally inline) images for a blog post via Gemini.

Usage:
  GEMINI_API_KEY=... python3 scripts/generate_post_images.py <slug>           # hero only (cheapest)
  GEMINI_API_KEY=... python3 scripts/generate_post_images.py <slug> --all     # hero + inline1 + inline2

Cost note: gemini-2.5-flash-image is ~$0.039/image. Default is hero-only to
minimise spend; pass --all only when the post body actually references the
inline images.
"""

import base64
import json
import os
import sys
import time
import urllib.request


def _load_dotenv():
    """Minimal .env loader — picks up KEY=VALUE lines from project .env."""
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    if not os.path.exists(env_path):
        return
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)


_load_dotenv()

API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not API_KEY:
    print("ERROR: GEMINI_API_KEY not set (checked env + .env).")
    sys.exit(1)

MODEL = "gemini-2.5-flash-image"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "blog")

# Per-slug image prompt sets. Add new entries here when publishing a new post.
PROMPT_SETS = {
    "position-sizing-for-trading-bots": {
        "hero": (
            "A glowing emerald position-sizing formula and percentage symbols floating "
            "in the foreground above a shrinking blue equity curve that dips into a "
            "deep drawdown. Dark fintech environment with subtle grid lines and "
            "candlestick chart elements in the background. Cinematic lighting, "
            "depth of field, photorealistic 3D render style, 16:9 aspect ratio."
        ),
    },
    "ai-trading-bots-2026": {
        "hero": (
            "A glowing neural network with interconnected emerald nodes projecting "
            "candlestick patterns and trade signals onto a dark futuristic trading "
            "floor. AI brain icon with circuit lines in the foreground, financial "
            "charts floating in background. Cinematic emerald-and-teal fintech "
            "aesthetic, photorealistic 3D render, 16:9 aspect ratio."
        ),
    },
    "funded-trader-bots-vs-personal-account": {
        "hero": (
            "A dramatic split-screen scene: left side shows a funded trader challenge "
            "dashboard with strict drawdown limits glowing in red and amber, right "
            "side shows a personal trading account with a freely compounding emerald "
            "equity curve climbing upward. Stacks of coins and currency symbols "
            "between them. Dark fintech aesthetic, cinematic lighting, 16:9 aspect ratio."
        ),
    },
    "pine-script-v6-whats-new": {
        "hero": (
            "A glowing Pine Script v6 code editor in a dark IDE theme showing modern "
            "syntax features with 'v6' version labels highlighted in emerald green. "
            "New language constructs and type definitions visible. TradingView-style "
            "chart in background. Cinematic fintech aesthetic, sharp typography, "
            "professional code editor look, 16:9 aspect ratio."
        ),
    },
    "trading-bot-fed-day-strategy": {
        "hero": (
            "A trading screen showing extreme red and green volatile candles during "
            "an FOMC announcement, with widened spread bars in red and a paused "
            "trading bot indicator with shield icon on the side. Federal Reserve "
            "building silhouette subtly in background. Dark cinematic fintech "
            "aesthetic with emerald, red, and amber accents, 16:9 aspect ratio."
        ),
    },
    "multi-timeframe-trading-bot": {
        "hero": (
            "A trading dashboard showing three synchronized chart panels stacked "
            "vertically — daily, 4-hour, and 15-minute timeframes — with aligned "
            "emerald trend arrows pointing the same direction across all three and "
            "confirmation checkmarks. Dark fintech aesthetic with emerald and teal "
            "accents, clean data visualization style, 16:9 aspect ratio."
        ),
    },
    "gbpjpy-trading-bot-strategy": {
        "hero": (
            "An extremely volatile GBPJPY candlestick chart with dramatic long wicks "
            "and rapid price spikes on a dark trading screen. Pound sterling (£) and "
            "Japanese yen (¥) symbols highlighted in red and emerald, with 'Beast Pair' "
            "subtle text. Lightning bolt and volatility indicators. Cinematic fintech "
            "aesthetic with dramatic red, gold, and emerald accents, 16:9 aspect ratio."
        ),
    },
    "detect-strategy-decay-trading-bot": {
        "hero": (
            "A trading dashboard showing two diverging equity curves: a smooth "
            "idealised backtest curve climbing steadily in emerald, and a degrading "
            "live trading curve dropping below it in amber and red. Warning "
            "indicators and alert icons highlighted between them. Dark fintech "
            "aesthetic, cinematic lighting, professional data visualization, "
            "16:9 aspect ratio."
        ),
    },
    "slippage-commission-trading-bot-costs": {
        "hero": (
            "A trading dashboard showing the gap between an idealised backtest line "
            "(emerald, climbing high) and a realistic live trading line (lower, with "
            "amber annotations showing slippage, spread, and commission cost labels). "
            "Coin stacks shrinking due to friction costs in the foreground. Dark "
            "fintech aesthetic, professional data visualization, 16:9 aspect ratio."
        ),
    },
    "trading-bot-tax-reporting-india-us": {
        "hero": (
            "A clean dark-themed financial dashboard showing tax document icons "
            "(Schedule D form, ITR form) alongside trading P&L charts. India and "
            "USA flag elements subtly displayed in the corners. Calculator and "
            "tax-percentage symbols. Emerald and gold accents on dark background, "
            "professional fintech aesthetic, 16:9 aspect ratio."
        ),
    },
    "ensemble-trading-strategies-bots": {
        "hero": (
            "Three colored strategy equity curves (emerald trend-following, teal "
            "mean-reversion, gold breakout) combining into a single smoother "
            "portfolio curve in white. Each strategy curve has its name label. "
            "Mathematical Sharpe ratio formula glowing above. Dark fintech "
            "aesthetic with emerald, teal, and gold accents, 16:9 aspect ratio."
        ),
    },
    "best-ai-trading-bots-2026": {
        "hero": (
            "A clean dark-themed comparison diagram showing nine different types of "
            "AI trading bot categories arranged in a 3x3 grid, each with its category "
            "icon (Pine Script, grid bot, scanner, no-code, EA, API, AI assistant, "
            "quant platform, free tools) in emerald and teal. Modern fintech "
            "infographic style, 16:9 aspect ratio."
        ),
        "comparison": (
            "A detailed feature-comparison infographic showing the trade-offs between "
            "strategy ownership, transparency, and cost across ten AI trading bot "
            "categories. Each category plotted on two axes with emerald highlighting "
            "for the top recommendation. Dark fintech background, clean data "
            "visualization style, 16:9 aspect ratio."
        ),
    },
    "best-forex-trading-bots-2026": {
        "hero": (
            "A dark themed forex trading dashboard showing multiple currency pair "
            "charts (EURUSD, GBPUSD, USDJPY, GBPJPY) with automated trading "
            "indicators glowing in emerald and teal. Modern fintech aesthetic with "
            "currency symbols (€ £ $ ¥) subtly floating, 16:9 aspect ratio."
        ),
        "comparison": (
            "A clean comparison chart showing the cost-per-trade and strategy-"
            "transparency trade-offs across six forex trading bot categories. Six "
            "data points plotted on a 2D axis with Pine Script platforms in the "
            "high-transparency / low-cost quadrant highlighted in emerald. Dark "
            "fintech background, 16:9 aspect ratio."
        ),
    },
    "best-gold-trading-bots-2026": {
        "hero": (
            "A dark trading screen showing XAUUSD gold price charts with automated "
            "trading indicators. Gold bars and ounce symbols glowing in warm gold "
            "and emerald accents floating in foreground. Cinematic fintech "
            "aesthetic, dramatic lighting, 16:9 aspect ratio."
        ),
        "comparison": (
            "A detailed feature comparison infographic showing five gold trading "
            "bot categories with their key parameters — spread sensitivity, capital "
            "requirement, automation level — color-coded with gold and emerald "
            "accents on a dark fintech background. Sharp typography, 16:9 aspect ratio."
        ),
    },
    "best-crypto-trading-bots-2026": {
        "hero": (
            "A dark fintech dashboard showing Bitcoin, Ethereum, and altcoin charts "
            "with automated bot indicators and grid lines glowing in emerald and "
            "teal. Bitcoin and Ethereum logos subtly visible. Modern cryptocurrency "
            "trading aesthetic, cinematic lighting, 16:9 aspect ratio."
        ),
        "comparison": (
            "A detailed comparison chart showing the trade-offs between strategy "
            "transparency, automation depth, and cost across six crypto trading bot "
            "categories. Color-coded with emerald, teal, and amber on a dark "
            "fintech background. Clean data visualization style, 16:9 aspect ratio."
        ),
    },
    "best-pine-script-strategies-2026": {
        "hero": (
            "A dark IDE-style display showing multiple Pine Script v6 strategy "
            "templates side by side, with emerald-highlighted code snippets and "
            "accompanying equity curves on a fintech background. Modern code editor "
            "aesthetic, syntax highlighting in green/blue/white, 16:9 aspect ratio."
        ),
        "comparison": (
            "A dark fintech infographic showing eight Pine Script strategy patterns "
            "plotted by market regime (trending vs ranging) on horizontal axis and "
            "complexity (easy vs hard) on vertical axis. Eight data points with "
            "emerald, teal, and amber color coding, clean typography, 16:9 aspect ratio."
        ),
    },
    "best-backtest-engines-2026": {
        "hero": (
            "A dark fintech dashboard showing a backtest engine running with "
            "realistic execution modeling — equity curves climbing, slippage "
            "annotations in amber, and broker spread visualizations in emerald. "
            "Multiple terminal windows showing test progress. Modern aesthetic, "
            "16:9 aspect ratio."
        ),
        "comparison": (
            "A detailed comparison infographic showing six backtest engine "
            "categories evaluated on six dimensions — realism, Pine Script support, "
            "ease of use, cost, multi-asset coverage, and walk-forward support. "
            "Radar chart or comparison matrix style with PineForge highlighted in "
            "emerald on a dark fintech background, 16:9 aspect ratio."
        ),
    },
    "best-trading-bots-for-beginners-2026": {
        "hero": (
            "A friendly dark-themed trading dashboard showing a simple Pine Script "
            "strategy with annotated step-by-step guides, beginner-friendly "
            "indicators, and emerald and teal accents. A 'Start Here' arrow and "
            "tutorial-style overlays. Welcoming fintech aesthetic, 16:9 aspect ratio."
        ),
        "comparison": (
            "A clear visual comparison showing beginner learning value (vertical "
            "axis) vs financial safety (horizontal axis) across six trading bot "
            "categories. Six data points with Pine Script platforms in the top-right "
            "quadrant highlighted in emerald. Dark fintech background, clean "
            "typography, 16:9 aspect ratio."
        ),
    },
    "best-mt5-automation-tools-2026": {
        "hero": (
            "A dark trading workstation showing the MT5 terminal interface alongside "
            "a modern Pine Script editor and Python notebook, connected by glowing "
            "emerald data flow lines representing the MetaAPI bridge. Modern "
            "fintech aesthetic, multiple displays, professional setup, 16:9 aspect ratio."
        ),
        "comparison": (
            "A detailed comparison infographic showing six MT5 automation tool "
            "categories with their strategy language, broker compatibility, and "
            "cost structure displayed clearly. Pine Script → MT5 highlighted in "
            "emerald. Dark fintech background, sharp typography, 16:9 aspect ratio."
        ),
    },
    "best-trading-bots-india-2026": {
        "hero": (
            "A dark fintech dashboard showing Indian rupee (₹) symbols, NSE and BSE "
            "index charts, USDINR currency F&O charts, and automated trading "
            "indicators. Subtle Indian flag accents in emerald and gold. Modern "
            "fintech aesthetic, 16:9 aspect ratio."
        ),
        "comparison": (
            "A clear comparison infographic showing five trading bot categories "
            "evaluated for Indian retail traders — regulatory clarity, INR support, "
            "instrument coverage, and tax efficiency. PineForge highlighted in "
            "emerald. Dark fintech background with subtle Indian rupee symbols, "
            "16:9 aspect ratio."
        ),
    },
    "best-free-trading-bot-tools-2026": {
        "hero": (
            "A dark fintech workspace showing multiple free trading tools — "
            "open-source code, free chart libraries, demo trading accounts — with "
            "cost-trade-off annotations in emerald and amber. 'Free' labels with "
            "asterisks showing hidden costs. Modern fintech aesthetic, 16:9 aspect ratio."
        ),
        "comparison": (
            "A detailed comparison showing six free trading tool categories "
            "evaluated on cost (time investment vs monetary), strategy quality, "
            "and suitability for production deployment. Quadrant-style chart on "
            "a dark fintech background with emerald and amber color coding, "
            "16:9 aspect ratio."
        ),
    },
}


def generate(slug, kind, prompt):
    output_path = os.path.join(OUTPUT_DIR, f"{slug}-{kind}.png")
    if os.path.exists(output_path) and os.path.getsize(output_path) > 10000:
        print(f"  SKIP {kind} (exists, {os.path.getsize(output_path) // 1024}KB)")
        return True

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"
    body = json.dumps({
        "contents": [{"parts": [{"text": f"Generate an image: {prompt}"}]}],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]},
    }).encode()
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})

    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = json.loads(resp.read())
            parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
            for p in parts:
                if "inlineData" in p:
                    img_data = base64.b64decode(p["inlineData"]["data"])
                    with open(output_path, "wb") as f:
                        f.write(img_data)
                    print(f"  OK   {kind} ({len(img_data) // 1024}KB)")
                    return True
            if attempt < 2:
                time.sleep(5)
                continue
            print(f"  FAIL {kind} — no image in response")
            return False
        except Exception as e:
            if attempt < 2:
                print(f"  retry {kind} — {e}")
                time.sleep(5)
                continue
            print(f"  FAIL {kind} — {e}")
            return False


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/generate_post_images.py <slug>")
        print(f"Available slugs: {list(PROMPT_SETS.keys())}")
        sys.exit(1)

    slug = sys.argv[1]
    if slug not in PROMPT_SETS:
        print(f"ERROR: no prompt set for slug '{slug}'.")
        print(f"Available: {list(PROMPT_SETS.keys())}")
        sys.exit(1)

    generate_all = "--all" in sys.argv
    prompts = PROMPT_SETS[slug]
    kinds = tuple(prompts.keys()) if generate_all else ("hero",)

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Generating {len(kinds)} image(s) for: {slug} (mode: {'all' if generate_all else 'hero-only'})\n")

    ok = 0
    for kind in kinds:
        if kind not in prompts:
            continue
        print(f"[{kind}]")
        if generate(slug, kind, prompts[kind]):
            ok += 1
        time.sleep(2)

    print(f"\nDone: {ok}/{len(kinds)} image(s) generated")
    print(f"Output: {OUTPUT_DIR}")
    print("Next: run `node scripts/optimize-images.mjs` to produce .webp variants.")
    return 0 if ok == len(prompts) else 1


if __name__ == "__main__":
    sys.exit(main())
