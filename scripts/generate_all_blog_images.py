"""Generate all blog images: hero + inline images for 10 SEO blog posts."""

import base64
import json
import os
import sys
import time
import urllib.request

API_KEY = os.environ.get("GEMINI_API_KEY", "")
MODEL = "gemini-2.5-flash-image"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "blog")

# All images to generate: hero + inline for each post
IMAGES = [
    # ═══ Post 1: What Is Algorithmic Trading ═══
    {"slug": "algo-trading-hero", "prompt": "A futuristic dark trading command center with multiple holographic screens showing live market data, candlestick charts, and algorithmic code. Emerald green and teal accent lighting. A single trader silhouette overseeing everything. Cinematic, wide angle, photorealistic."},
    {"slug": "algo-trading-speed", "prompt": "A visual metaphor showing speed: digital data streams racing through fiber optic cables at light speed, with stock ticker numbers blurring past. Dark background with green neon trails. Abstract digital art, clean and modern."},
    {"slug": "algo-trading-workflow", "prompt": "A clean infographic-style diagram on dark background showing the algo trading workflow: Write Strategy → Backtest → Deploy Bot → Monitor. Each step in a glowing emerald box connected by arrows. Minimalist fintech design."},

    # ═══ Post 2: Backtesting Guide ═══
    {"slug": "backtesting-hero", "prompt": "A dramatic split-screen visualization: left side shows raw historical market data flowing into a machine, right side shows polished performance charts and metrics emerging. Dark theme with emerald green highlights. Digital art, clean and futuristic."},
    {"slug": "backtesting-metrics", "prompt": "A dark-themed analytics dashboard showing key backtesting metrics in elegant cards: Win Rate 74%, Profit Factor 2.31, Max Drawdown -8.3%, Sharpe Ratio 2.14, Total Return +87.4%. Glowing emerald numbers on dark background. Clean fintech UI mockup."},
    {"slug": "backtesting-mistakes", "prompt": "A warning-themed illustration: a cracked magnifying glass examining a misleading upward chart that hides problems underneath. Red warning signs and caution symbols. Dark background. Concept art about data analysis pitfalls."},

    # ═══ Post 3: Pine Script Tutorial ═══
    {"slug": "pine-script-hero", "prompt": "A floating holographic code editor in dark space showing Pine Script code with green syntax highlighting. Mathematical formulas and chart patterns orbit around it like atoms. Futuristic, cinematic, dark background with emerald glow."},
    {"slug": "pine-script-code", "prompt": "A clean screenshot-style image of Pine Script code on a dark code editor. Shows a simple EMA crossover strategy with syntax highlighting: green for functions, white for variables, gray for comments. Professional IDE appearance. Dark theme."},
    {"slug": "pine-script-indicators", "prompt": "A beautiful data visualization showing multiple technical indicators overlaid on a candlestick chart: moving averages as smooth lines, RSI oscillator below, Bollinger Bands as shaded areas. Dark background, neon green and blue lines. Clean financial chart art."},

    # ═══ Post 4: Trading Bots Deep Dive ═══
    {"slug": "trading-bots-hero", "prompt": "A sleek humanoid robot hand precisely placing a chess piece on a trading chart grid. The chess piece is a golden bull. Dark dramatic lighting with emerald accents. Concept: strategy and precision. Cinematic, photorealistic."},
    {"slug": "trading-bots-lifecycle", "prompt": "A circular flow diagram on dark background showing the bot lifecycle: Connect → Monitor → Analyze → Execute → Report → back to Monitor. Each node is a glowing emerald circle with an icon. Clean infographic style."},
    {"slug": "trading-bots-24-7", "prompt": "A split image: left half shows a sleeping human in bed at night with a clock showing 3AM, right half shows a digital bot actively trading with green charts on screens. The contrast between human rest and bot activity. Dark cinematic mood."},

    # ═══ Post 5: Risk Management ═══
    {"slug": "risk-management-hero", "prompt": "A dramatic image of a digital shield made of green energy protecting a stack of gold coins from incoming red arrows (representing losses). The shield deflects the arrows. Dark background with dramatic lighting. Financial protection concept art."},
    {"slug": "risk-management-position-sizing", "prompt": "A clean dark-themed infographic showing position sizing: a pie chart with 1-2% risk per trade highlighted in emerald, the rest in dark gray. Below: formula showing Lot Size = Risk / Stop Loss Distance. Clean minimalist design."},
    {"slug": "risk-management-drawdown", "prompt": "A dramatic equity curve chart on dark background showing a strategy recovering from a drawdown. The dip is highlighted in red, the recovery in bright green. Annotations showing 'Max Drawdown -8.3%' and 'Recovery Period'. Clean financial chart."},

    # ═══ Post 6: Gold XAUUSD Strategies ═══
    {"slug": "gold-strategies-hero", "prompt": "Luxurious gold bars arranged on a dark trading desk with holographic XAUUSD price charts floating above them. Green candlestick patterns visible in the hologram. Warm gold and cool emerald color palette. Photorealistic, cinematic."},
    {"slug": "gold-strategies-ema", "prompt": "A clean candlestick chart of gold (XAUUSD) on dark background showing two moving average lines crossing over. The crossover point is highlighted with a bright green arrow indicating a buy signal. Professional trading chart style."},
    {"slug": "gold-strategies-bollinger", "prompt": "A XAUUSD candlestick chart on dark background with Bollinger Bands drawn as shaded emerald zones. Price bouncing off the lower band with a green buy arrow. RSI indicator below showing oversold condition. Clean professional chart."},

    # ═══ Post 7: Forex vs Crypto ═══
    {"slug": "forex-crypto-hero", "prompt": "A dramatic split composition: left side shows traditional forex with USD, EUR, GBP currency symbols in cool blue steel tones. Right side shows Bitcoin and Ethereum in warm orange-gold digital tones. They meet in the center with green trading lines. Dark background."},
    {"slug": "forex-crypto-comparison", "prompt": "A dark-themed comparison table graphic: Forex vs Crypto side by side. Categories: Market Hours, Volatility, Spreads, Liquidity. Forex side in blue, Crypto side in orange. Clean infographic style on dark background."},
    {"slug": "forex-crypto-symbols", "prompt": "A grid of trading symbol cards on dark background: EURUSD, GBPUSD, XAUUSD, USDJPY in blue tones on the left, BTCUSD and ETHUSD in orange tones on the right. Each card shows the symbol name and a tiny sparkline chart. Clean fintech design."},

    # ═══ Post 8: Build Your First Bot ═══
    {"slug": "first-bot-hero", "prompt": "A developer's hands on a laptop keyboard with the screen showing a bot configuration interface. Floating holographic elements show a strategy connecting to a broker via glowing green lines. Dark ambient desk setup. Cinematic, shallow depth of field."},
    {"slug": "first-bot-steps", "prompt": "A vertical step-by-step infographic on dark background: Step 1 Sign Up (user icon), Step 2 Connect MT5 (link icon), Step 3 Choose Strategy (code icon), Step 4 Backtest (chart icon), Step 5 Deploy Bot (rocket icon), Step 6 Monitor (eye icon). Emerald green icons connected by lines."},
    {"slug": "first-bot-dashboard", "prompt": "A dark-themed bot monitoring dashboard showing: Bot Status RUNNING (green dot), Live P&L +$234.50 in green, Recent Trades list with green/red entries, and a small real-time price chart. Clean fintech UI with emerald accents. Professional screenshot style."},

    # ═══ Post 9: Trading Indicators ═══
    {"slug": "indicators-hero", "prompt": "A spectacular visualization of multiple trading indicators layered on a large candlestick chart: glowing EMA lines, RSI oscillator, MACD histogram, and Bollinger Bands. All in different neon colors on dark background. Beautiful data visualization art."},
    {"slug": "indicators-rsi-macd", "prompt": "A clean two-panel chart on dark background: top panel shows RSI oscillator with overbought (70) and oversold (30) zones highlighted. Bottom panel shows MACD with signal line crossover highlighted by a green arrow. Professional trading chart style."},
    {"slug": "indicators-bollinger-atr", "prompt": "A candlestick chart on dark background with Bollinger Bands as shaded regions and ATR indicator below as a separate panel showing volatility expansion and contraction. Clean lines, professional financial chart. Dark theme with emerald and blue accents."},

    # ═══ Post 10: Automated vs Manual Trading ═══
    {"slug": "auto-vs-manual-hero", "prompt": "A dramatic side-by-side comparison: left shows a stressed human trader with messy desk, multiple coffee cups, papers, squinting at screens. Right shows a clean robotic setup with organized screens all showing green profits. Dramatic lighting contrast. Cinematic illustration."},
    {"slug": "auto-vs-manual-emotions", "prompt": "An abstract visualization of trading emotions: a human head silhouette filled with chaotic red, yellow, and orange swirls (fear, greed, FOMO). Next to it, a robot head filled with calm green circuits and organized data flow. Dark background. Concept art."},
    {"slug": "auto-vs-manual-results", "prompt": "A dark-themed scoreboard comparing Manual vs Automated trading across 6 metrics. Automated wins 5 out of 6 with green checkmarks. Categories: Speed, Discipline, Coverage, Consistency, Learning, Adaptability. Clean infographic on dark background."},
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
                    print(f"  OK   {slug} ({len(img_data) // 1024}KB)")
                    return True

            reason = data.get("candidates", [{}])[0].get("finishReason", "unknown")
            if attempt < 2:
                print(f"  RETRY {slug} (attempt {attempt+1}, reason={reason})")
                time.sleep(5)
                continue
            print(f"  FAIL {slug} — no image (reason={reason})")
            return False

        except Exception as e:
            if attempt < 2:
                print(f"  RETRY {slug} (attempt {attempt+1}, error={e})")
                time.sleep(5)
                continue
            print(f"  FAIL {slug} — {e}")
            return False


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Generating {len(IMAGES)} blog images...\n")

    success = 0
    for i, img in enumerate(IMAGES):
        print(f"[{i + 1}/{len(IMAGES)}] {img['slug']}")
        if generate_image(img["slug"], img["prompt"]):
            success += 1
        if i < len(IMAGES) - 1:
            time.sleep(2)

    print(f"\nDone: {success}/{len(IMAGES)} images generated")
    print(f"Output: {OUTPUT_DIR}")
    return 0 if success == len(IMAGES) else 1


if __name__ == "__main__":
    sys.exit(main())
