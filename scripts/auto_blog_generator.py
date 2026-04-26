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
    # ── Wave 3: extended pool ─────────────────────────────────────
    {"keyword": "prop firm trading bot", "title_hint": "Trading Bots for Prop Firm Challenges", "category": "Strategy"},
    {"keyword": "FTMO bot strategy", "title_hint": "FTMO-Style Strategies That Pass the Challenge", "category": "Strategy"},
    {"keyword": "news trading bot", "title_hint": "Should Your Bot Trade News? The Honest Answer", "category": "Education"},
    {"keyword": "high frequency trading retail", "title_hint": "Can Retail Traders Do High-Frequency Trading?", "category": "Education"},
    {"keyword": "multi timeframe strategy", "title_hint": "Multi-Timeframe Strategies in Pine Script", "category": "Tutorial"},
    {"keyword": "pine script v5 features", "title_hint": "Pine Script v5: The Features That Actually Matter", "category": "Tutorial"},
    {"keyword": "pine script libraries", "title_hint": "Pine Script Libraries Worth Knowing", "category": "Tutorial"},
    {"keyword": "pine script strategy.entry", "title_hint": "strategy.entry vs strategy.order: When to Use Which", "category": "Tutorial"},
    {"keyword": "donchian channel strategy", "title_hint": "Donchian Channel Breakout: The Turtle Strategy", "category": "Strategy"},
    {"keyword": "supertrend indicator", "title_hint": "SuperTrend in Pine Script: The Complete Guide", "category": "Strategy"},
    {"keyword": "ichimoku trading", "title_hint": "Ichimoku Cloud Strategies for Automated Trading", "category": "Strategy"},
    {"keyword": "fibonacci retracement bot", "title_hint": "Fibonacci Retracement: From Manual Tool to Bot Logic", "category": "Strategy"},
    {"keyword": "pivot points strategy", "title_hint": "Pivot Point Strategies for Intraday Bots", "category": "Strategy"},
    {"keyword": "VWAP strategy", "title_hint": "VWAP Strategies for Bot Traders", "category": "Strategy"},
    {"keyword": "Heikin Ashi candles", "title_hint": "Heikin Ashi: Smoother Charts, Cleaner Signals", "category": "Education"},
    {"keyword": "renko chart strategy", "title_hint": "Renko Charts and Bot Strategies", "category": "Strategy"},
    {"keyword": "AUDUSD strategy", "title_hint": "AUDUSD Trading: Aussie Pair Strategies", "category": "Strategy"},
    {"keyword": "USDCHF strategy", "title_hint": "USDCHF Trading Strategies for Bots", "category": "Strategy"},
    {"keyword": "NZDUSD strategy", "title_hint": "NZDUSD (Kiwi) Trading Strategies", "category": "Strategy"},
    {"keyword": "US30 trading strategy", "title_hint": "US30 (Dow Jones) Bot Strategies", "category": "Strategy"},
    {"keyword": "Nasdaq 100 trading bot", "title_hint": "USTEC (Nasdaq 100) Bot Strategies", "category": "Strategy"},
    {"keyword": "session based trading", "title_hint": "Session-Based Strategies: London, NY, Tokyo", "category": "Strategy"},
    {"keyword": "London open strategy", "title_hint": "The London Open: Trading the World's Busiest Hour", "category": "Strategy"},
    {"keyword": "asian session range", "title_hint": "Asian Session Range Trading Strategies", "category": "Strategy"},
    {"keyword": "weekend gap trading", "title_hint": "Weekend Gaps in Forex and Crypto: Edge or Trap?", "category": "Education"},
    {"keyword": "spread cost trading", "title_hint": "How Spread Costs Eat Your Profits (And What to Do)", "category": "Education"},
    {"keyword": "swap fees forex", "title_hint": "Swap Fees Explained: The Hidden Cost of Holding", "category": "Education"},
    {"keyword": "leverage trading risks", "title_hint": "Leverage in Trading: Friend, Foe, or Both?", "category": "Education"},
    {"keyword": "broker comparison MT5", "title_hint": "Best MT5 Brokers Compared for Bot Trading", "category": "Education"},
    {"keyword": "Exness vs Pepperstone", "title_hint": "Exness vs Pepperstone: Which Broker for Bots?", "category": "Education"},
    {"keyword": "VPS vs cloud trading", "title_hint": "VPS vs Cloud Hosted Bots: The Real Comparison", "category": "Education"},
    {"keyword": "walk forward analysis", "title_hint": "Walk-Forward Analysis: Beyond Simple Backtesting", "category": "Education"},
    {"keyword": "monte carlo simulation trading", "title_hint": "Monte Carlo Simulation for Trading Strategies", "category": "Education"},
    {"keyword": "out of sample testing", "title_hint": "Out-of-Sample Testing: The Test Most Traders Skip", "category": "Education"},
    {"keyword": "overfitting trading strategies", "title_hint": "Overfitting: The #1 Killer of Backtested Strategies", "category": "Education"},
    {"keyword": "kelly criterion trading", "title_hint": "The Kelly Criterion for Position Sizing", "category": "Education"},
    {"keyword": "risk reward ratio", "title_hint": "Risk-Reward Ratios That Actually Work", "category": "Education"},
    {"keyword": "expectancy trading", "title_hint": "Trading Expectancy: The Formula That Matters", "category": "Education"},
    {"keyword": "discretionary vs systematic", "title_hint": "Discretionary vs Systematic Trading: A Data View", "category": "Education"},
    {"keyword": "portfolio of bots", "title_hint": "Building a Portfolio of Trading Bots", "category": "Strategy"},
    {"keyword": "uncorrelated strategies", "title_hint": "Why You Need Uncorrelated Strategies", "category": "Education"},
    {"keyword": "regime detection trading", "title_hint": "Market Regime Detection in Pine Script", "category": "Tutorial"},
    {"keyword": "ADX indicator", "title_hint": "ADX: The Indicator That Filters Chop", "category": "Education"},
    {"keyword": "stochastic oscillator", "title_hint": "Stochastic Oscillator: Beyond the Default Settings", "category": "Strategy"},
    {"keyword": "volume profile trading", "title_hint": "Volume Profile for Algorithmic Trading", "category": "Strategy"},
    {"keyword": "order flow basics", "title_hint": "Order Flow Trading for Bot Builders", "category": "Education"},
    {"keyword": "pairs trading strategy", "title_hint": "Pairs Trading: Statistical Arbitrage for Retail", "category": "Strategy"},
    {"keyword": "cointegration trading", "title_hint": "Cointegration in Trading: Beyond Correlation", "category": "Education"},
    {"keyword": "tax implications algo trading", "title_hint": "Algorithmic Trading and Taxes: What You Need to Know", "category": "Education"},
    {"keyword": "demo account testing", "title_hint": "From Demo to Live: The Bridge Most Traders Botch", "category": "Education"},
    {"keyword": "first bot mistakes", "title_hint": "7 Mistakes Every First-Time Bot Trader Makes", "category": "Education"},
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
- Use inline images with ![alt text](/blog/IMAGE_SLUG.webp) syntax

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
- Include 2 image placeholders: ![description](/blog/SLUG-inline1.webp) and ![description](/blog/SLUG-inline2.webp)
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


def _gemini_call(messages, response_mime=None, max_tokens=8192):
    """Low-level Gemini API call with retry on 429/5xx."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    gen_config = {"temperature": 0.8, "maxOutputTokens": max_tokens}
    if response_mime:
        gen_config["responseMimeType"] = response_mime

    body = json.dumps({
        "contents": messages,
        "generationConfig": gen_config,
    }).encode()

    for attempt in range(5):
        req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=180) as resp:
                data = json.loads(resp.read())
            return data["candidates"][0]["content"]["parts"][0]["text"]
        except urllib.error.HTTPError as e:
            if e.code == 429 or e.code >= 500:
                wait = (attempt + 1) * 15  # 15s, 30s, 45s, 60s, 75s
                print(f"    API {e.code}, waiting {wait}s (attempt {attempt + 1}/5)...")
                time.sleep(wait)
                continue
            raise
        except Exception as e:
            if attempt < 4:
                print(f"    Error: {e}, retrying in 10s...")
                time.sleep(10)
                continue
            raise


def gemini_generate_text(prompt):
    """Generate blog post: one call for content, extract metadata from it."""

    # Single call: get full blog content as plain markdown
    content_prompt = f"""{SYSTEM_PROMPT}

{prompt}

Write the full blog post in markdown. Do NOT wrap in JSON or code blocks.
Start with a compelling first paragraph (no title heading — title is handled separately).
Include 2 image placeholders:
![description](/blog/PLACEHOLDER-inline1.webp)
![description](/blog/PLACEHOLDER-inline2.webp)"""

    content = ""
    for attempt in range(3):
        try:
            content = _gemini_call(
                [
                    {"role": "user", "parts": [{"text": content_prompt}]},
                ],
                max_tokens=8192,
            )
            # Strip any JSON/code wrapper Gemini might add
            content = content.strip()
            if content.startswith("```"):
                content = re.sub(r'^```\w*\n?', '', content)
            if content.endswith("```"):
                content = content[:-3].strip()

            if len(content.split()) > 200:
                break
            print(f"    Content too short ({len(content.split())} words), retrying...")
        except Exception as e:
            print(f"    Content attempt {attempt + 1}/3 failed: {e}")
        if attempt < 2:
            time.sleep(3)

    # Extract title from first H1/H2 or first line, then generate metadata locally
    title_match = re.search(r'^#{1,2}\s+(.+)', content, re.MULTILINE)
    if title_match:
        title = title_match.group(1).strip()
        # Remove the title line from content (it's displayed separately by BlogPost.jsx)
        content = content[:title_match.start()] + content[title_match.end():]
        content = content.strip()
    else:
        # Use first sentence as title
        first_line = content.split('\n')[0].strip()
        title = first_line[:100] if len(first_line) > 10 else prompt.split('\n')[0][:80]

    # Build first ~150 chars as excerpt
    plain_text = re.sub(r'[#*\[\]()!]', '', content)
    excerpt = plain_text.strip()[:160].rsplit(' ', 1)[0] + "..."

    # Generate image prompts from the topic
    keyword = prompt.split('Primary keyword:')[1].split('\n')[0].strip() if 'Primary keyword:' in prompt else 'trading'
    metadata = {
        "title": title,
        "excerpt": excerpt,
        "content": content,
        "image_prompt_hero": f"A professional dark-themed image representing {keyword}. Emerald green and teal accents on dark background. Modern fintech style, cinematic lighting.",
        "image_prompt_inline1": f"A clean infographic or chart about {keyword} on dark background. Green accents, professional data visualization.",
        "image_prompt_inline2": f"A trading dashboard or analytics view related to {keyword}. Dark theme with emerald highlights. Screenshot style.",
    }
    return metadata


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
        f'    image: "/blog/{post_data["slug"]}-hero.webp",\n'
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
