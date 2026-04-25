#!/usr/bin/env python3
"""
Auto Blog Generator — generates SEO-optimized blog posts for PineForge.

Runs 3x per week via cron. Uses Google Gemini for content writing and image generation.
Follows the seo-writer skill guidelines: brand voice, SEO keywords, internal links, social proof.

Usage:
  python3 scripts/auto_blog_generator.py              # Generate 1 post
  python3 scripts/auto_blog_generator.py --dry-run    # Preview without saving
  python3 scripts/auto_blog_generator.py --deploy     # Generate + git commit + vercel deploy

Cron (Mon/Wed/Fri 8am):
  0 8 * * 1,3,5 cd /path/to/PineForge-FrontEnd && /usr/bin/python3 scripts/auto_blog_generator.py --deploy >> /tmp/auto_blog.log 2>&1
"""

import base64
import json
import os
import random
import re
import subprocess
import sys
import time
import urllib.request
from datetime import datetime

# ── Config ───────────────────────────────────────────────────────

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not GEMINI_API_KEY:
    print("ERROR: GEMINI_API_KEY environment variable is required.")
    print("Set it via: export GEMINI_API_KEY=your_key_here")
    sys.exit(1)
GEMINI_MODEL = "gemini-2.5-flash"
IMAGE_MODEL = "gemini-2.5-flash-image"
BLOG_DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "src", "data", "blogPosts.js")
IMAGE_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "blog")
PROJECT_DIR = os.path.join(os.path.dirname(__file__), "..")

# ── Topic Pool ───────────────────────────────────────────────────
# The generator picks from this pool, skipping topics already published.

TOPIC_POOL = [
    {"keyword": "forex scalping bot", "title_hint": "Forex Scalping with Trading Bots", "category": "Strategy"},
    {"keyword": "swing trading bot", "title_hint": "Swing Trading Strategies for Bots", "category": "Strategy"},
    {"keyword": "MT5 trading bot", "title_hint": "MetaTrader 5 Bot Setup Guide", "category": "Tutorial"},
    {"keyword": "trading bot for beginners", "title_hint": "Complete Beginner's Guide to Trading Bots", "category": "Education"},
    {"keyword": "best trading bot 2026", "title_hint": "Best Trading Bots Compared", "category": "Education"},
    {"keyword": "crypto trading bot", "title_hint": "Crypto Trading Bot Strategies", "category": "Strategy"},
    {"keyword": "backtest crypto strategy", "title_hint": "How to Backtest Crypto Strategies", "category": "Tutorial"},
    {"keyword": "EMA crossover strategy", "title_hint": "EMA Crossover: The Strategy That Works", "category": "Strategy"},
    {"keyword": "RSI strategy", "title_hint": "RSI Trading Strategy Explained", "category": "Strategy"},
    {"keyword": "MACD strategy", "title_hint": "MACD Strategy for Automated Trading", "category": "Strategy"},
    {"keyword": "Bollinger Bands strategy", "title_hint": "Bollinger Band Trading Strategies", "category": "Strategy"},
    {"keyword": "trend following strategy", "title_hint": "Trend Following: A Timeless Approach", "category": "Strategy"},
    {"keyword": "mean reversion strategy", "title_hint": "Mean Reversion Strategies That Work", "category": "Strategy"},
    {"keyword": "breakout strategy", "title_hint": "Breakout Trading with Bots", "category": "Strategy"},
    {"keyword": "position sizing", "title_hint": "Position Sizing: The Math Behind Survival", "category": "Education"},
    {"keyword": "Sharpe ratio", "title_hint": "Understanding Sharpe Ratio for Traders", "category": "Education"},
    {"keyword": "maximum drawdown", "title_hint": "Maximum Drawdown: What It Is and Why It Matters", "category": "Education"},
    {"keyword": "equity curve", "title_hint": "Reading Your Equity Curve Like a Pro", "category": "Education"},
    {"keyword": "win rate profit factor", "title_hint": "Win Rate vs Profit Factor: Which Matters More?", "category": "Education"},
    {"keyword": "trading psychology", "title_hint": "Trading Psychology: Why Your Mind Is Your Worst Enemy", "category": "Education"},
    {"keyword": "GBPUSD strategy", "title_hint": "GBPUSD Trading Strategies for Bots", "category": "Strategy"},
    {"keyword": "USDJPY strategy", "title_hint": "USDJPY Trading: Yen Pair Strategies", "category": "Strategy"},
    {"keyword": "ETHUSD strategy", "title_hint": "Ethereum Trading Bot Strategies", "category": "Strategy"},
    {"keyword": "silver trading strategy", "title_hint": "Silver (XAGUSD) Trading Strategies", "category": "Strategy"},
    {"keyword": "index trading bot", "title_hint": "Trading S&P 500 and Nasdaq with Bots", "category": "Strategy"},
    {"keyword": "stop loss strategy", "title_hint": "Stop-Loss Strategies That Actually Work", "category": "Strategy"},
    {"keyword": "trailing stop loss", "title_hint": "Trailing Stop-Losses for Automated Trading", "category": "Strategy"},
    {"keyword": "ATR indicator", "title_hint": "ATR Indicator: The Volatility Secret Weapon", "category": "Education"},
    {"keyword": "24/7 trading bot", "title_hint": "Running Trading Bots 24/7: What You Need to Know", "category": "Education"},
    {"keyword": "automated order execution", "title_hint": "How Automated Order Execution Works", "category": "Education"},
    {"keyword": "multiple trading bots", "title_hint": "Running Multiple Bots on One Account", "category": "Tutorial"},
    {"keyword": "backtest mistakes", "title_hint": "7 Backtesting Mistakes That Cost Traders Money", "category": "Education"},
    {"keyword": "strategy optimization", "title_hint": "Strategy Optimization Without Overfitting", "category": "Education"},
    {"keyword": "trading bot risks", "title_hint": "The Risks of Trading Bots (And How to Manage Them)", "category": "Education"},
    {"keyword": "pay per use trading", "title_hint": "Pay-Per-Use vs Subscription Trading Platforms", "category": "Education"},
    {"keyword": "cloud trading bot", "title_hint": "Cloud vs Local Trading Bots: Which Is Better?", "category": "Education"},
]

# ── Tone & Style Prompt ──────────────────────────────────────────

SYSTEM_PROMPT = """You are the PineForge SEO content writer. Write blog posts following these exact rules:

BRAND VOICE:
- Confident, direct, rational — make statements, not suggestions
- Concise — minimal filler, high signal. Short punchy sentences.
- Contrast-driven — human vs machine, emotion vs logic
- Empowering — user is the strategist, product is the enabler
- Use "you" (second person), contractions, parallel phrasing

NEVER USE: "revolutionary", "game-changing", "insane profits", "guaranteed returns", "amazing", "incredible opportunity", "life-changing", "cutting-edge", "innovative solutions"

SEO RULES:
- Primary keyword in: title, first paragraph, 2-3 H2 headings
- 2-4 FAQ-style question headings (H2 or H3)
- Include Pine Script code examples when relevant (use ```pine blocks)
- Include markdown tables when comparing data
- Use inline images with ![alt text](/blog/IMAGE_SLUG.png) syntax

INTERNAL LINKS (use naturally within content):
- [PineForge](https://getpineforge.com)
- [backtest](/backtest)
- [Pine Script guide](/blog/pine-script-beginners-guide)
- [trading bots](/blog/trading-bots-explained)
- [risk management](/blog/risk-management-strategies)
- [gold strategies](/blog/gold-trading-strategies)
- [forex vs crypto](/blog/forex-vs-crypto-trading)
- [build your first bot](/blog/how-to-build-your-first-bot)
- [trading indicators](/blog/understanding-trading-indicators)
- [algorithmic trading](/blog/what-is-algorithmic-trading)
- [pricing](/pricing)
- [signup](https://getpineforge.com/signup)

SOCIAL PROOF (use 1-2 when relevant):
- XAUUSD EMA strategy: 74.2% win rate, 2.31 profit factor, +87.4% return
- BTCUSD swing: +124.6% return, 62.8% win rate, Sharpe 2.14
- EURUSD trend: +208.3% return over 3 years, 412 trades
- Multi-bot user: 4 bots, $5K+ combined P&L
- Platform: 13 symbols, 28+ strategies, 99.9% uptime

STRUCTURE:
- Introduction: 150-200 words. Hook with pain point, promise solution.
- Body: 4-6 H2 sections, each with 2-3 H3s. Short paragraphs (2-4 sentences).
- Include 2 image placeholders: ![description](/blog/SLUG-inline1.png) and ![description](/blog/SLUG-inline2.png)
- Conclusion: 100-150 words with CTA to signup/backtest.
- Target: ~2000 words total.

OUTPUT FORMAT: Return ONLY valid JSON with these fields:
{
  "title": "SEO title with primary keyword",
  "excerpt": "150-char meta description with keyword",
  "content": "Full markdown blog post content",
  "image_prompt_hero": "Detailed prompt for hero image generation",
  "image_prompt_inline1": "Detailed prompt for first inline image",
  "image_prompt_inline2": "Detailed prompt for second inline image"
}
"""


def gemini_generate_text(prompt):
    """Call Gemini API for text generation."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    body = json.dumps({
        "contents": [
            {"role": "user", "parts": [{"text": SYSTEM_PROMPT}]},
            {"role": "model", "parts": [{"text": "Understood. I will write SEO-optimized blog posts following PineForge's brand voice, structure, and guidelines. Send me the topic."}]},
            {"role": "user", "parts": [{"text": prompt}]},
        ],
        "generationConfig": {
            "temperature": 0.8,
            "maxOutputTokens": 8192,
            "responseMimeType": "application/json",
        },
    }).encode()

    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read())

    text = data["candidates"][0]["content"]["parts"][0]["text"]
    return json.loads(text)


def gemini_generate_image(prompt, output_path):
    """Generate an image using Gemini Image API."""
    if os.path.exists(output_path) and os.path.getsize(output_path) > 10000:
        print(f"    SKIP image (exists)")
        return True

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{IMAGE_MODEL}:generateContent?key={GEMINI_API_KEY}"
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
                    print(f"    OK image ({len(img_data) // 1024}KB)")
                    return True
            if attempt < 2:
                time.sleep(5)
                continue
            return False
        except Exception as e:
            if attempt < 2:
                time.sleep(5)
                continue
            print(f"    FAIL image: {e}")
            return False


def get_existing_slugs():
    """Read existing blog post slugs from blogPosts.js."""
    if not os.path.exists(BLOG_DATA_FILE):
        return set()
    with open(BLOG_DATA_FILE, "r") as f:
        content = f.read()
    return set(re.findall(r'slug:\s*"([^"]+)"', content))


def make_slug(title):
    """Generate URL slug from title."""
    slug = re.sub(r'[^a-z0-9\s-]', '', title.lower())
    slug = re.sub(r'[\s]+', '-', slug.strip())
    slug = re.sub(r'-+', '-', slug)
    return slug[:60].rstrip('-')


def add_post_to_file(post_data):
    """Append a new blog post to blogPosts.js."""
    with open(BLOG_DATA_FILE, "r") as f:
        content = f.read()

    # Find the closing ]; and insert before it
    escaped_title = post_data['title'].replace('"', '\\"')
    escaped_excerpt = post_data['excerpt'].replace('"', '\\"')
    keywords_json = json.dumps(post_data['keywords'])
    # Escape backticks in content to avoid breaking JS template literals
    safe_content = post_data["content"].replace("`", "\\`").replace("${", "\\${")
    new_post = (
        '\n  {\n'
        f'    slug: "{post_data["slug"]}",\n'
        f'    title: "{escaped_title}",\n'
        f'    excerpt: "{escaped_excerpt}",\n'
        f'    category: "{post_data["category"]}",\n'
        f'    date: "{post_data["date"]}",\n'
        f'    readTime: "{post_data["readTime"]}",\n'
        f'    image: "/blog/{post_data["slug"]}-hero.png",\n'
        f'    keywords: {keywords_json},\n'
        '    content: `\n'
        f'{safe_content}\n'
        '    `,\n'
        '  },'
    )

    # Insert before the final ];
    content = content.rstrip()
    if content.endswith("];"):
        content = content[:-2] + new_post + "\n];\n"
    elif content.endswith(",\n];"):
        content = content[:-3] + new_post + "\n];\n"
    else:
        # Fallback: find last ]; pattern
        content = content.rsplit("];", 1)
        content = content[0] + new_post + "\n];\n" + (content[1] if len(content) > 1 else "")

    with open(BLOG_DATA_FILE, "w") as f:
        f.write(content)


def pick_topic(existing_slugs):
    """Pick a topic that hasn't been published yet."""
    existing_keywords = set()
    for slug in existing_slugs:
        # Extract likely keywords from slug
        existing_keywords.update(slug.replace("-", " ").split())

    # Filter and score topics
    available = []
    for topic in TOPIC_POOL:
        slug = make_slug(topic["title_hint"])
        if slug not in existing_slugs:
            available.append(topic)

    if not available:
        print("All topics exhausted! Add more to TOPIC_POOL.")
        return None

    return random.choice(available)


def estimate_read_time(content):
    """Estimate read time from word count."""
    words = len(content.split())
    minutes = max(3, round(words / 250))
    return f"{minutes} min read"


def generate_post(topic, dry_run=False):
    """Generate a complete blog post with images."""
    print(f"\nGenerating post: {topic['title_hint']}")
    print(f"  Keyword: {topic['keyword']}")
    print(f"  Category: {topic['category']}")

    # Step 1: Generate content
    print("  Writing content...")
    prompt = f"""Write a blog post about: {topic['title_hint']}

Primary keyword: {topic['keyword']}
Category: {topic['category']}
Target audience: Retail forex/gold/crypto traders, beginners to intermediate

Use image slugs: {make_slug(topic['title_hint'])}-inline1 and {make_slug(topic['title_hint'])}-inline2

Include 3-5 internal links, 1-2 social proof stats, 2-4 FAQ-style headings, and Pine Script code if relevant.
End with CTA to PineForge signup or backtesting."""

    result = gemini_generate_text(prompt)

    slug = make_slug(result.get("title", topic["title_hint"]))
    content = result.get("content", "")
    title = result.get("title", topic["title_hint"])
    excerpt = result.get("excerpt", f"Learn about {topic['keyword']} and how to use it with PineForge.")

    # Replace image slug placeholders with actual slugs
    content = content.replace("SLUG-inline1", f"{slug}-inline1")
    content = content.replace("SLUG-inline2", f"{slug}-inline2")

    print(f"  Title: {title}")
    print(f"  Words: {len(content.split())}")

    if dry_run:
        print("\n  [DRY RUN] Would generate images and save post.")
        print(f"  Excerpt: {excerpt}")
        return None

    # Step 2: Generate images
    os.makedirs(IMAGE_DIR, exist_ok=True)

    print("  Generating hero image...")
    hero_prompt = result.get("image_prompt_hero", f"A professional dark-themed image about {topic['keyword']}. Emerald green accents on dark background. Fintech style.")
    gemini_generate_image(hero_prompt, os.path.join(IMAGE_DIR, f"{slug}-hero.png"))
    time.sleep(3)

    print("  Generating inline image 1...")
    inline1_prompt = result.get("image_prompt_inline1", f"An infographic about {topic['keyword']} on dark background with green accents. Clean fintech design.")
    gemini_generate_image(inline1_prompt, os.path.join(IMAGE_DIR, f"{slug}-inline1.png"))
    time.sleep(3)

    print("  Generating inline image 2...")
    inline2_prompt = result.get("image_prompt_inline2", f"A data visualization related to {topic['keyword']}. Dark theme, emerald highlights. Professional chart style.")
    gemini_generate_image(inline2_prompt, os.path.join(IMAGE_DIR, f"{slug}-inline2.png"))

    # Step 3: Save post
    post_data = {
        "slug": slug,
        "title": title,
        "excerpt": excerpt,
        "category": topic["category"],
        "date": datetime.now().strftime("%Y-%m-%d"),
        "readTime": estimate_read_time(content),
        "keywords": [topic["keyword"]] + topic["keyword"].split()[:3],
        "content": content,
    }

    add_post_to_file(post_data)
    print(f"  Saved: {slug}")

    return post_data


def deploy():
    """Git commit and Vercel deploy."""
    print("\nDeploying...")
    os.chdir(PROJECT_DIR)

    subprocess.run(["git", "add", "-A"], check=True)

    # Check if there are changes to commit
    result = subprocess.run(["git", "diff", "--cached", "--quiet"])
    if result.returncode == 0:
        print("  No changes to commit.")
        return

    date = datetime.now().strftime("%Y-%m-%d")
    subprocess.run([
        "git", "commit", "-m", f"Auto-generate blog post ({date})\n\nCo-Authored-By: PineForge SEO Writer <noreply@getpineforge.com>"
    ], check=True)

    subprocess.run(["git", "push", "origin", "master"], check=True)
    print("  Pushed to git.")

    # Deploy to Vercel
    subprocess.run(["npx", "vercel", "--prod", "--yes"], check=True, timeout=300)
    print("  Deployed to Vercel.")


def main():
    dry_run = "--dry-run" in sys.argv
    should_deploy = "--deploy" in sys.argv

    existing = get_existing_slugs()
    print(f"Existing posts: {len(existing)}")

    topic = pick_topic(existing)
    if not topic:
        return 1

    post = generate_post(topic, dry_run=dry_run)

    if post and should_deploy:
        deploy()

    print("\nDone!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
