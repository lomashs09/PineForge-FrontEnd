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
    kinds = ("hero", "inline1", "inline2") if generate_all else ("hero",)

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    prompts = PROMPT_SETS[slug]
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
