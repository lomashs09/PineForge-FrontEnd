# PineForge — Complete Sitemap

**Domain:** https://getpineforge.com
**Last Updated:** April 25, 2026

---

## Public Pages (No Login Required)

| URL | Page | Description |
|-----|------|-------------|
| `/` | Landing Page | Homepage with hero section, feature showcase, performance charts, testimonials, and CTA to signup. |
| `/pricing` | Pricing | Pay-as-you-go billing model. Trading Account Setup ($3.00), Active Bot ($0.022/hr), Account Hosting ($0.002/hr), Bot Deployment ($0.13/start). |
| `/about` | About | Company mission and values — Strategy First, Security by Design, Real Execution, Pine Script Native. Stats: 28+ strategies, 10+ symbols, 5 timeframes, 24/7 automation. |
| `/docs` | Documentation | Getting started guide, backtesting docs, trading accounts, bot management, risk management. Includes FAQ section. |
| `/support` | Support | Contact channels — email (support@getpineforge.com), documentation link, GitHub. FAQ with common issues. |
| `/blog` | Blog | Blog listing page with search, category filtering (Education, Tutorial, Strategy). Featured post hero + card grid. CTA to signup at bottom. |
| `/terms` | Terms of Service | Legal terms covering acceptance, service description, and risk disclaimer. |
| `/privacy` | Privacy Policy | Data privacy policy — information collection, usage, automatic collection, third-party sharing (Stripe). |
| `/cancellation` | Cancellation & Refund Policy | Usage-based billing refund policy, account top-up amounts, cancellation terms. |

## Authentication Pages

| URL | Page | Description |
|-----|------|-------------|
| `/login` | Login | Email/password login form. Option to resend verification email. |
| `/signup` | Sign Up | Registration form — full name, email, password, confirm password. Requires Terms of Service acceptance. |
| `/check-email` | Check Your Email | Post-signup page prompting user to verify email. Option to resend verification. |
| `/verify-email?token=<token>` | Email Verification | Processes email verification token. Shows success or error state. |

## Protected Pages (Login Required)

| URL | Page | Description |
|-----|------|-------------|
| `/dashboard` | Dashboard | Overview stats — active bots, total P&L, win rate, total trades. Bot cards with status and quick actions. |
| `/bots` | My Bots | Bot management — create, start, stop, delete bots. View positions, trades, logs per bot. Configure symbol, timeframe, lot size, risk limits. |
| `/strategies` | Strategies | Pine Script strategy management — upload, view, edit, delete. Code viewer with syntax highlighting. |
| `/backtest` | Backtest Engine | Run backtests on any strategy. Select symbol, timeframe, date range, capital. Results: equity curve, metrics (return, win rate, profit factor, drawdown, Sharpe), trade list. |
| `/accounts` | Trading Accounts | MT5 broker account management — connect, view, delete. Enter MT5 login, password, server. Connection guide included. |
| `/billing` | Billing & Usage | Account balance, usage summary (bot hours, account hosting, deployments), pricing rates, transaction history. Add funds via Stripe (INR) or PayPal (USD). |
| `/payment-success` | Payment Success | Post-payment confirmation after Stripe/PayPal checkout. Links to dashboard. |

## Blog Posts

| URL | Title | Category | Read Time |
|-----|-------|----------|-----------|
| `/blog/what-is-algorithmic-trading` | What Is Algorithmic Trading and Why It's the Future | Education | 6 min |
| `/blog/why-backtest-before-you-trade` | Why You Should Always Backtest Before Trading Live | Education | 5 min |
| `/blog/pine-script-beginners-guide` | Pine Script for Beginners: Write Your First Strategy | Tutorial | 8 min |
| `/blog/trading-bots-explained` | Trading Bots: How They Work and Why Traders Love Them | Education | 5 min |
| `/blog/risk-management-strategies` | Risk Management: The #1 Skill That Separates Winners from Losers | Strategy | 7 min |
| `/blog/gold-trading-strategies` | Top Gold (XAUUSD) Trading Strategies for 2026 | Strategy | 7 min |
| `/blog/forex-vs-crypto-trading` | Forex vs Crypto Trading: Which Is Right for Your Bot? | Education | 6 min |
| `/blog/how-to-build-your-first-bot` | Step-by-Step: Build and Deploy Your First Trading Bot | Tutorial | 8 min |
| `/blog/understanding-trading-indicators` | Trading Indicators Explained: RSI, MACD, Bollinger Bands & More | Education | 9 min |
| `/blog/automated-trading-vs-manual` | Automated vs Manual Trading: Why Bots Win in the Long Run | Education | 5 min |

## API Endpoints (Backend)

**Base URL:** https://api.getpineforge.com

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/health` | GET | No | Server health check — DB status, running bots, uptime, version |
| `/api/auth/register` | POST | No | User registration |
| `/api/auth/login` | POST | No | Login — returns access + refresh tokens |
| `/api/auth/refresh` | POST | Yes | Refresh access token |
| `/api/auth/me` | GET | Yes | Current user profile |
| `/api/auth/resend-verification` | POST | No | Resend email verification |
| `/api/auth/verify-email` | POST | No | Verify email with token |
| `/api/scripts` | GET | Yes | List user's scripts |
| `/api/scripts` | POST | Yes | Create new script (Pine Script validation) |
| `/api/scripts/{id}` | GET | Yes | Get script by ID |
| `/api/scripts/{id}` | PUT | Yes | Update script |
| `/api/scripts/{id}` | DELETE | Yes | Delete script |
| `/api/scripts/{id}/backtest` | POST | Yes | Run backtest on script |
| `/api/scripts/backtest/config` | GET | Yes | Get available symbols, intervals, date limits |
| `/api/accounts` | GET | Yes | List connected MT5 accounts |
| `/api/accounts` | POST | Yes | Connect new MT5 account ($3.00 setup fee) |
| `/api/accounts/{id}` | GET | Yes | Get account details |
| `/api/accounts/{id}` | DELETE | Yes | Delete account |
| `/api/bots` | GET | Yes | List user's bots |
| `/api/bots` | POST | Yes | Create new bot |
| `/api/bots/{id}` | GET | Yes | Get bot details + live status |
| `/api/bots/{id}` | PUT | Yes | Update bot configuration |
| `/api/bots/{id}` | DELETE | Yes | Delete bot |
| `/api/bots/{id}/start` | POST | Yes | Start bot ($0.152 deploy + 1hr prepaid) |
| `/api/bots/{id}/stop` | POST | Yes | Stop bot (closes positions) |
| `/api/bots/{id}/logs` | GET | Yes | Get bot execution logs |
| `/api/bots/{id}/trades` | GET | Yes | Get bot trade history |
| `/api/bots/{id}/stats` | GET | Yes | Get bot performance stats |
| `/api/bots/{id}/history` | GET | Yes | Get broker deal history (via MetaAPI) |
| `/api/dashboard` | GET | Yes | Dashboard summary data |
| `/api/billing/usage` | GET | Yes | Current period usage and balance |
| `/api/billing/transactions` | GET | Yes | Transaction history (paginated, filterable by type) |
| `/api/payments/fx-rate` | GET | Yes | Current INR→USD exchange rate |
| `/api/payments/add-funds` | POST | Yes | Create Stripe checkout (INR only) |
| `/api/payments/paypal/create-order` | POST | Yes | Create PayPal order (USD) |
| `/api/payments/paypal/capture` | POST | Yes | Capture PayPal payment |
| `/api/payments/webhook` | POST | No | Stripe webhook (checkout.completed, checkout.expired) |
| `/api/payments/portal` | POST | Yes | Create Stripe billing portal session |

## Page Count Summary

| Category | Count |
|----------|-------|
| Public pages | 9 |
| Auth pages | 4 |
| Protected pages | 7 |
| Blog posts | 10 |
| **Total pages** | **30** |
| API endpoints | 33 |
