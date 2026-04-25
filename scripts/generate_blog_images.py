"""Generate blog hero images using Google Gemini 2.5 Flash Image API."""

import base64
import json
import os
import sys
import time
import urllib.request

API_KEY = "AIzaSyD3BumiKCBCmcs837bdX-OtGrD_Y3rYeLA"
MODEL = "gemini-2.5-flash-image"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "blog")

POSTS = [
    {
        "slug": "what-is-algorithmic-trading",
        "prompt": "A sophisticated algorithmic trading setup with multiple monitors showing live market charts, candlestick patterns, and code overlays in a dark modern office. Green and emerald accent lighting. Photorealistic, cinematic, 16:9 aspect ratio.",
    },
    {
        "slug": "why-backtest-before-you-trade",
        "prompt": "A split-screen visualization: left side shows historical stock chart data flowing into a computer, right side shows performance metrics and profit graphs. Dark theme with emerald green highlights. Digital art, clean and modern.",
    },
    {
        "slug": "pine-script-beginners-guide",
        "prompt": "A glowing code editor floating in dark space showing trading script code with Pine Script syntax highlighting in green. Abstract geometric patterns and chart elements in background. Digital art, futuristic.",
    },
    {
        "slug": "trading-bots-explained",
        "prompt": "A sleek robot sitting at a trading desk, analyzing multiple floating holographic market charts in green and teal. Dark futuristic environment. The robot looks modern and friendly, not threatening. Cinematic lighting.",
    },
    {
        "slug": "risk-management-strategies",
        "prompt": "A digital shield protecting a stack of gold coins and currency symbols, with red warning arrows being deflected. Dark background with emerald green protective glow. Financial security concept art.",
    },
    {
        "slug": "gold-trading-strategies",
        "prompt": "Shiny gold bars and gold nuggets on a dark trading desk, with holographic XAUUSD price charts floating above them in green. Luxurious dark atmosphere with warm gold and cool emerald accents. Photorealistic.",
    },
    {
        "slug": "forex-vs-crypto-trading",
        "prompt": "A dramatic split composition: one side shows traditional forex currency symbols (USD, EUR, GBP) in blue tones, the other side shows Bitcoin and Ethereum symbols in orange tones. They meet in the middle with green trading chart lines. Dark background.",
    },
    {
        "slug": "how-to-build-your-first-bot",
        "prompt": "A developer's workspace with a laptop showing bot configuration interface, connected to floating market charts by glowing green lines. Step-by-step flow visualization. Dark modern desk setup with emerald accent lighting. Clean digital illustration.",
    },
    {
        "slug": "understanding-trading-indicators",
        "prompt": "Beautiful visualization of trading indicators - RSI, MACD, Bollinger Bands, and Moving Averages overlaid on a large candlestick chart. Glowing neon lines on dark background. Data visualization art, clean and educational.",
    },
    {
        "slug": "automated-trading-vs-manual",
        "prompt": "Side by side comparison: left side shows a stressed human trader with messy desk and coffee cups, right side shows a calm robotic arm making precise trades on a clean setup. Dramatic lighting contrast. Modern illustration style.",
    },
]


def generate_image(slug, prompt):
    """Generate one image via Gemini API."""
    output_path = os.path.join(OUTPUT_DIR, f"{slug}.png")
    if os.path.exists(output_path):
        size = os.path.getsize(output_path)
        if size > 10000:
            print(f"  SKIP {slug} (already exists, {size // 1024}KB)")
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

        print(f"  FAIL {slug} — no image in response")
        return False

    except Exception as e:
        print(f"  FAIL {slug} — {e}")
        return False


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Generating {len(POSTS)} blog images...\n")

    success = 0
    for i, post in enumerate(POSTS):
        print(f"[{i + 1}/{len(POSTS)}] {post['slug']}")
        if generate_image(post["slug"], post["prompt"]):
            success += 1
        # Rate limit: small delay between requests
        if i < len(POSTS) - 1:
            time.sleep(2)

    print(f"\nDone: {success}/{len(POSTS)} images generated")
    print(f"Output: {OUTPUT_DIR}")
    return 0 if success == len(POSTS) else 1


if __name__ == "__main__":
    sys.exit(main())
