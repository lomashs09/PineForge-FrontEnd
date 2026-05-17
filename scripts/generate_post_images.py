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
        "inline1": (
            "A clean dark-themed infographic comparing risk-per-trade percentages — "
            "1%, 2%, 3%, and 5% — as four vertical bars showing drawdown depth after "
            "ten consecutive losing trades. Each bar labeled with its risk level and "
            "resulting drawdown percentage. Emerald green for the 1% bar, yellow for "
            "2%, orange for 3%, red for 5%. Minimalist data-visualization style on "
            "dark navy background. Sharp typography, professional fintech aesthetic."
        ),
        "inline2": (
            "A Pine Script code editor in a dark IDE theme showing a strategy() "
            "declaration with default_qty_type and default_qty_value parameters "
            "highlighted in emerald green. Glowing annotation arrows pointing at the "
            "risk percentage value. Syntax highlighting in green, blue, and white on "
            "near-black background. Clean modern code editor aesthetic, slight bloom "
            "on the highlighted parameters. 16:9 aspect ratio."
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
