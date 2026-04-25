"""Generate showcase/social proof images using Gemini 2.5 Flash Image API."""

import base64
import json
import os
import sys
import time
import urllib.request

API_KEY = os.environ.get("GEMINI_API_KEY", "")
MODEL = "gemini-2.5-flash-image"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "showcase")

IMAGES = [
    # Profitable backtest results
    {
        "slug": "backtest-gold-74-winrate",
        "prompt": "A clean dark-themed trading dashboard screenshot showing backtest results for XAUUSD Gold strategy. Display: Total Return +87.4%, Win Rate 74.2%, Profit Factor 2.31, 156 Total Trades, Max Drawdown -8.3%. Show a smooth upward equity curve chart in bright green on dark background. Modern fintech UI design with rounded corners and subtle grid. Professional and clean.",
    },
    {
        "slug": "backtest-btc-124-return",
        "prompt": "A dark-themed trading dashboard showing Bitcoin BTCUSD backtest results. Display: Total Return +124.6%, Win Rate 62.8%, Profit Factor 1.89, 203 Trades, Sharpe Ratio 2.14. Show a steadily rising equity curve with minor dips, in emerald green on black background. Clean modern UI with stat cards at the top. Professional fintech screenshot style.",
    },
    {
        "slug": "backtest-eurusd-200-return",
        "prompt": "A sleek dark trading dashboard showing EURUSD forex backtest results. Display: Total Return +208.3%, Win Rate 58.4%, Profit Factor 2.67, 412 Trades over 3 years, Max Drawdown -11.2%. Show a strong upward equity curve from $10,000 to $30,830 in bright green. Dark background with emerald accents. Professional screenshot style.",
    },
    # Live bot P&L screenshots
    {
        "slug": "bot-profit-xauusd-live",
        "prompt": "A dark-themed live trading bot dashboard showing a running XAUUSD Gold bot with real-time P&L. Display: Status RUNNING (green dot), Current P&L +$847.20, Today +$126.50, Win Rate 71%, 34 trades this month. Show a small real-time price chart with entry/exit markers in green and red. Modern dark UI with emerald green accents. Professional screenshot.",
    },
    {
        "slug": "bot-multiple-profits",
        "prompt": "A dark trading dashboard showing 4 running bots in a list/grid. Each bot card shows: Bot name, symbol, status (running with green pulse dot), and P&L in green. Bot 1: Gold Scalper XAUUSD +$1,247, Bot 2: EUR Trend EURUSD +$623, Bot 3: BTC Swing BTCUSD +$2,891, Bot 4: Cable Breakout GBPUSD +$445. All showing green profit numbers. Dark background, emerald accents. Clean fintech UI.",
    },
    # Win rate and reward ratio
    {
        "slug": "winrate-stats-dashboard",
        "prompt": "A dark-themed analytics dashboard showing impressive trading statistics. Large circular progress chart showing 73% Win Rate in emerald green. Below it: cards showing Profit Factor 2.45, Average Win $234.50, Average Loss -$89.20, Risk Reward Ratio 2.63:1, Best Trade +$1,247. Clean dark UI with green accents. Professional data visualization.",
    },
    {
        "slug": "reward-ratio-chart",
        "prompt": "A clean dark-themed chart visualization showing trade distribution. A bar chart with green bars (winning trades) much taller than red bars (losing trades). Display Risk:Reward ratio of 3.2:1 prominently. Show 67% win rate badge. Average winner: +$312, Average loser: -$97. Dark background with emerald and red color scheme. Professional financial chart style.",
    },
    # Return milestones
    {
        "slug": "100-percent-return",
        "prompt": "A celebratory dark-themed dashboard showing a trading milestone. Large bold text: +100% RETURN with a glowing emerald green effect. Below it an equity curve doubling from $10,000 to $20,000 over 6 months. Confetti or sparkle effects subtly in the background. Stats: 186 trades, 68% win rate, 2.1 profit factor. Dark fintech UI, professional but exciting.",
    },
    {
        "slug": "200-percent-return",
        "prompt": "A premium dark-themed dashboard showing exceptional performance. Large gold and green text: +200% RETURN. Equity curve tripling from $10,000 to $30,000 over 12 months with smooth uptrend. Gold trophy or achievement badge icon. Stats: 342 trades, 71% win rate, 2.8 profit factor, Sharpe 2.4. Dark background with gold and emerald accents. Luxurious fintech style.",
    },
    # Testimonial style images
    {
        "slug": "testimonial-trader-desk",
        "prompt": "A professional photo of a young Indian male trader smiling confidently at his desk with multiple monitors showing green trading charts in the background. Modern home office setup with dark ambient lighting and green screen glow. The trader looks successful and relaxed. Shallow depth of field, cinematic portrait style.",
    },
    {
        "slug": "testimonial-woman-trader",
        "prompt": "A professional photo of a young woman trader in a modern office, looking at her laptop screen showing a trading dashboard with green profit numbers. She has a confident smile. Clean modern workspace with a second monitor visible. Soft warm lighting. Professional portrait style, shallow depth of field.",
    },
    {
        "slug": "testimonial-mobile-trader",
        "prompt": "A close-up photo of hands holding a smartphone showing a trading bot dashboard with green P&L numbers (+$1,247.50). The person is sitting in a cafe with a coffee cup visible. Natural lighting. The phone screen shows a dark-themed app with emerald green accents. Lifestyle photography style, warm tones.",
    },
    # Strategy performance
    {
        "slug": "strategy-comparison-chart",
        "prompt": "A dark-themed chart comparing 4 different trading strategies' equity curves over 1 year. Each line in a different color (green, blue, purple, amber) showing upward trends. Legend: EMA Crossover +87%, Bollinger Reversion +64%, RSI Filter +112%, Breakout +93%. All starting from $10,000. Clean grid background, dark theme. Professional data visualization.",
    },
    {
        "slug": "monthly-returns-heatmap",
        "prompt": "A dark-themed heatmap calendar showing monthly trading returns over 12 months. Most months in green (positive returns: +5% to +12%), two months in light red (-2% to -4%). Overall trend very positive. Shows total annual return +87.4% at the bottom. Clean modern fintech dashboard style with dark background and emerald green dominant color.",
    },
    # Social proof / numbers
    {
        "slug": "platform-stats",
        "prompt": "A dark-themed dashboard showing impressive platform statistics in large bold numbers. Active Traders: 2,847. Bots Running: 1,203. Total Trades Executed: 847,291. Strategies Created: 4,156. Symbols Supported: 13. Uptime: 99.9%. Dark background with emerald green number highlights. Clean minimalist fintech design. Professional and trustworthy.",
    },
    {
        "slug": "trade-history-profits",
        "prompt": "A dark-themed trade history table showing recent bot trades. Each row shows: Date, Symbol, Direction (BUY/SELL), Entry Price, Exit Price, P&L. Most trades in green profit: +$45.20, +$127.80, +$89.50, -$32.10, +$156.40, +$78.90, +$201.30. Alternating dark row colors. Clean monospace numbers. Professional trading platform screenshot style.",
    },
]


def generate_image(slug, prompt):
    output_path = os.path.join(OUTPUT_DIR, f"{slug}.png")
    if os.path.exists(output_path) and os.path.getsize(output_path) > 10000:
        print(f"  SKIP {slug} (exists)")
        return True

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"
    body = json.dumps({
        "contents": [{"parts": [{"text": f"Generate an image: {prompt}"}]}],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]},
    }).encode()

    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read())

        parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
        for p in parts:
            if "inlineData" in p:
                img_data = base64.b64decode(p["inlineData"]["data"])
                with open(output_path, "wb") as f:
                    f.write(img_data)
                print(f"  OK   {slug} ({len(img_data) // 1024}KB)")
                return True

        # Check for safety block
        block_reason = data.get("candidates", [{}])[0].get("finishReason", "")
        if block_reason:
            print(f"  FAIL {slug} — blocked: {block_reason}")
        else:
            print(f"  FAIL {slug} — no image in response")
        return False

    except Exception as e:
        print(f"  FAIL {slug} — {e}")
        return False


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Generating {len(IMAGES)} showcase images...\n")

    success = 0
    for i, img in enumerate(IMAGES):
        print(f"[{i + 1}/{len(IMAGES)}] {img['slug']}")
        if generate_image(img["slug"], img["prompt"]):
            success += 1
        if i < len(IMAGES) - 1:
            time.sleep(3)

    print(f"\nDone: {success}/{len(IMAGES)} images generated")
    return 0 if success == len(IMAGES) else 1


if __name__ == "__main__":
    sys.exit(main())
