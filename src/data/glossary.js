// Glossary entries — each one is a programmatic SEO landing page at
// /glossary/<slug>. Every entry must have:
//   - title       (H1, also used in meta title)
//   - excerpt     (meta description, ~150 chars)
//   - definition  (1-2 sentence plain-English definition)
//   - body        (markdown-ish: ## headings, **bold**, links via [text](url))
//   - related     (slugs of other glossary entries)
//   - linkedStrategies (slugs of strategies that demonstrate the term)
//   - category    ('indicator' | 'metric' | 'concept' | 'instrument')

const glossary = [
  {
    slug: 'ema',
    title: 'EMA (Exponential Moving Average)',
    category: 'indicator',
    excerpt: 'The exponential moving average weights recent price data more heavily than older bars, making it faster to react than a simple moving average.',
    definition: 'An exponential moving average is a type of moving average that places greater weight on the most recent price data, so it reacts faster to new information than a simple moving average (SMA) of the same length.',
    body: `
## Why traders use EMA
The EMA is the most-used indicator in algorithmic trading because it captures trend direction with minimal lag. The formula is recursive — each new EMA value depends on the previous one — which makes it efficient to calculate on streaming bars.

## Formula
\`EMA = (close × k) + (previous EMA × (1 − k))\`, where \`k = 2 / (length + 1)\`.

For a 21-period EMA, \`k ≈ 0.0909\`. Each new bar contributes ~9% to the running value.

## EMA in Pine Script
\`\`\`pinescript
fast = ta.ema(close, 9)
slow = ta.ema(close, 21)
if ta.crossover(fast, slow)
    strategy.entry("Long", strategy.long)
\`\`\`

## Common pairings
The 9/21 and 50/200 EMA pairs are the most-used trend-following setups. See [EMA Crossover](/strategies/ema-crossover) for a complete strategy template.
    `,
    related: ['sma', 'rsi', 'crossover', 'lag'],
    linkedStrategies: ['ema-crossover', 'triple-ema', 'atr-trend-follow'],
  },
  {
    slug: 'sma',
    title: 'SMA (Simple Moving Average)',
    category: 'indicator',
    excerpt: 'The simple moving average is the unweighted mean of the last N bars — slower to react than an EMA but with smoother output.',
    definition: 'A simple moving average is the arithmetic mean of the last N closing prices. It treats every bar in the window equally, which makes it slower to react than an EMA but produces a smoother line.',
    body: `
## When SMA wins
SMAs cut whipsaws. The 50/200 SMA "golden cross" / "death cross" on daily charts of major indices is the most-cited long-term trend signal in finance — and it actually works on indices precisely because the lag filters noise.

## Formula
\`SMA(N) = (close[0] + close[1] + ... + close[N-1]) / N\`

## SMA in Pine Script
\`\`\`pinescript
fast = ta.sma(close, 50)
slow = ta.sma(close, 200)
\`\`\`

See [SMA Crossover](/strategies/sma-crossover) for the canonical golden-cross strategy.
    `,
    related: ['ema', 'crossover', 'lag'],
    linkedStrategies: ['sma-crossover'],
  },
  {
    slug: 'rsi',
    title: 'RSI (Relative Strength Index)',
    category: 'indicator',
    excerpt: 'The RSI oscillates between 0 and 100, measuring the velocity of recent gains vs losses to identify overbought and oversold conditions.',
    definition: 'The Relative Strength Index is a momentum oscillator that measures the magnitude of recent price changes on a 0–100 scale. Readings above 70 suggest overbought conditions; below 30 suggest oversold.',
    body: `
## How RSI works
RSI compares the average gain over N bars to the average loss. When gains dominate, RSI rises toward 100; when losses dominate, it falls toward 0. The default length is 14 bars.

## Formula
\`RSI = 100 − (100 / (1 + RS))\`, where \`RS = average gain / average loss\` over N bars.

## Mean reversion vs trend confirmation
RSI is typically used two ways:
1. **Mean reversion** — buy below 30, exit above 70. See [RSI Mean Reversion](/strategies/rsi-mean-reversion).
2. **Trend confirmation** — long-only when RSI > 50, short-only when RSI < 50. Cuts trades against the prevailing trend.

## RSI in Pine Script
\`\`\`pinescript
rsi = ta.rsi(close, 14)
if rsi < 30
    strategy.entry("Long", strategy.long)
\`\`\`
    `,
    related: ['macd', 'stochastic', 'momentum', 'overbought-oversold'],
    linkedStrategies: ['rsi-mean-reversion'],
  },
  {
    slug: 'macd',
    title: 'MACD (Moving Average Convergence Divergence)',
    category: 'indicator',
    excerpt: 'MACD shows the relationship between two EMAs of price — used to spot trend changes and momentum shifts.',
    definition: 'MACD plots the difference between a 12-period EMA and a 26-period EMA, alongside a 9-period EMA of that difference (the signal line). Crossovers between the two lines mark momentum shifts.',
    body: `
## Components
- **MACD line** — 12 EMA minus 26 EMA
- **Signal line** — 9 EMA of the MACD line
- **Histogram** — MACD line minus signal line

## Common signals
A bullish MACD crossover (MACD line crosses above signal) often precedes EMA crossovers, providing earlier entry. The histogram visualises momentum: growing bars = accelerating, shrinking = decelerating.

## MACD in Pine Script
\`\`\`pinescript
[macdLine, signalLine, histLine] = ta.macd(close, 12, 26, 9)
if ta.crossover(macdLine, signalLine)
    strategy.entry("Long", strategy.long)
\`\`\`
    `,
    related: ['ema', 'rsi', 'momentum'],
    linkedStrategies: ['ema-crossover', 'triple-ema'],
  },
  {
    slug: 'bollinger-bands',
    title: 'Bollinger Bands',
    category: 'indicator',
    excerpt: 'Bollinger Bands plot two standard deviations above and below a moving average, defining a dynamic range for price.',
    definition: 'Bollinger Bands consist of a middle SMA (typically 20 periods) and two outer bands placed at 2 standard deviations above and below. The bands widen in volatile markets and contract in quiet ones.',
    body: `
## Reading the bands
Roughly 95% of price action falls inside the bands under a normal distribution. A close outside the bands is a statistical extreme — either a strong trend continuation or a reversal candidate, depending on context.

## Squeeze
When the bands narrow inside the Keltner Channel, volatility is unusually low — a "squeeze". Squeezes precede explosive moves. See [Squeeze Breakout](/strategies/squeeze-breakout).

## In Pine Script
\`\`\`pinescript
basis = ta.sma(close, 20)
dev = ta.stdev(close, 20) * 2
upper = basis + dev
lower = basis - dev
\`\`\`

See [Bollinger Band Reversion](/strategies/bollinger-bands) for the canonical mean-reversion implementation.
    `,
    related: ['atr', 'standard-deviation', 'volatility'],
    linkedStrategies: ['bollinger-bands', 'squeeze-breakout'],
  },
  {
    slug: 'atr',
    title: 'ATR (Average True Range)',
    category: 'indicator',
    excerpt: "ATR measures volatility by averaging the true range — the largest of today's high-low, |high-close[1]|, or |low-close[1]| — over N bars.",
    definition: "Average True Range is a volatility indicator. The 'true range' for any bar is the largest of: today's high minus today's low, the absolute value of today's high minus yesterday's close, or the absolute value of today's low minus yesterday's close. ATR is the average of true range over N bars (default 14).",
    body: `
## What ATR is for
ATR doesn't predict direction — it sizes risk. A stop placed at \`entry − 2 × ATR\` adapts automatically: tight on quiet EUR/USD, wide on volatile Bitcoin. The same parameter works across markets.

## Formula
\`TR = max(high − low, |high − close[1]|, |low − close[1]|)\`
\`ATR = ta.rma(TR, 14)\`

## In Pine Script
\`\`\`pinescript
atr = ta.atr(14)
stop_loss = strategy.position_avg_price - atr * 2
\`\`\`

See [ATR Trend Follow](/strategies/atr-trend-follow) for a complete volatility-adaptive strategy.
    `,
    related: ['volatility', 'bollinger-bands', 'risk-management'],
    linkedStrategies: ['atr-trend-follow'],
  },
  {
    slug: 'crossover',
    title: 'Crossover',
    category: 'concept',
    excerpt: 'A crossover happens when one series crosses above another — used as the entry signal in moving-average and oscillator-based strategies.',
    definition: 'A crossover occurs on the bar where one series moves from below another to above it. The reverse — moving from above to below — is a "crossunder". Crossovers are the building blocks of trend-following strategies.',
    body: `
## In Pine Script
\`\`\`pinescript
if ta.crossover(fast, slow)
    strategy.entry("Long", strategy.long)
if ta.crossunder(fast, slow)
    strategy.close("Long")
\`\`\`

\`ta.crossover(a, b)\` returns true only on the single bar where the cross happens — not while \`a > b\` continues to hold.

## Signal quality
Crossovers fire late by design. A crossover happens after the relationship has already changed — that latency is the cost you pay for filtering whipsaws. Tighter MAs (e.g. 3/8) react faster but generate more false signals.
    `,
    related: ['ema', 'sma', 'lag', 'whipsaw'],
    linkedStrategies: ['ema-crossover', 'sma-crossover'],
  },
  {
    slug: 'sharpe-ratio',
    title: 'Sharpe Ratio',
    category: 'metric',
    excerpt: 'The Sharpe ratio measures excess return per unit of volatility — the most-cited risk-adjusted performance metric in finance.',
    definition: 'The Sharpe ratio is the excess return of a strategy (return minus the risk-free rate) divided by its volatility (standard deviation of returns). Higher is better — it tells you how much return you are getting per unit of risk taken.',
    body: `
## Formula
\`Sharpe = (R_p − R_f) / σ_p\`, where \`R_p\` is portfolio return, \`R_f\` is the risk-free rate, and \`σ_p\` is the standard deviation of portfolio returns.

## Interpretation
- **< 1.0** — sub-par; you're taking on volatility without proportional return
- **1.0 – 2.0** — acceptable for retail strategies
- **2.0 – 3.0** — strong
- **> 3.0** — exceptional, often unsustainable, often a sign of overfitting in backtests

## Caveats
Sharpe penalises upside volatility just as much as downside. The Sortino ratio (which uses only downside deviation) is sometimes more honest. Sharpe also assumes returns are normally distributed — they aren't, especially in crypto.
    `,
    related: ['sortino-ratio', 'profit-factor', 'drawdown', 'volatility'],
    linkedStrategies: [],
  },
  {
    slug: 'sortino-ratio',
    title: 'Sortino Ratio',
    category: 'metric',
    excerpt: 'Like Sharpe, but only counts downside volatility — a more honest measure for asymmetric strategies.',
    definition: "The Sortino ratio is excess return divided by downside deviation (only the standard deviation of negative returns). It's a refinement of the Sharpe ratio that doesn't penalise a strategy for big upside moves.",
    body: `
## Why it's better than Sharpe
Sharpe penalises a strategy that has occasional huge winners just as much as one with consistent losses. Sortino only counts the downside — which is what investors actually care about. A strategy that's "too volatile" because it produced +30% months has a low Sharpe and a high Sortino.

## Formula
\`Sortino = (R_p − R_f) / σ_d\`, where \`σ_d\` is the standard deviation of returns *below* the target return (often zero or the risk-free rate).

## When to use which
- Use **Sharpe** for benchmarking against indices and traditional strategies.
- Use **Sortino** for trend-following, options, and crypto strategies where upside is fat-tailed.
    `,
    related: ['sharpe-ratio', 'drawdown', 'profit-factor'],
    linkedStrategies: [],
  },
  {
    slug: 'drawdown',
    title: 'Drawdown',
    category: 'metric',
    excerpt: "Drawdown is the percentage decline from a peak in your account equity to the next trough — the most important number in risk management.",
    definition: 'Drawdown measures how far your account equity has fallen from its previous peak, expressed as a percentage. The maximum drawdown over a backtest or live track record is the worst peak-to-trough loss.',
    body: `
## The math of recovery
Drawdown is asymmetric — recovering from a 50% loss requires a 100% gain, not 50%. This is why every serious risk manager prioritises drawdown over raw return.

| Drawdown | Recovery needed |
|---|---|
| 10% | 11.1% |
| 20% | 25% |
| 33% | 49% |
| 50% | 100% |
| 75% | 300% |
| 90% | 900% |

## Tolerable levels
Most retail strategies should target a max drawdown under 20%. Above 30%, most traders panic and abandon the system — exactly when they shouldn't. Position sizing is the only true control.

## In PineForge
Every backtest reports max drawdown and the equity curve. Filter out strategies with > 25% drawdown unless you have a specific reason to accept it.
    `,
    related: ['max-drawdown', 'risk-management', 'kelly-criterion', 'sharpe-ratio'],
    linkedStrategies: [],
  },
  {
    slug: 'profit-factor',
    title: 'Profit Factor',
    category: 'metric',
    excerpt: 'Profit factor is gross winning trades divided by gross losing trades — a quick test of whether a strategy has any edge at all.',
    definition: 'Profit factor is the sum of all profits divided by the sum of all losses (in absolute terms). A profit factor above 1.0 means the strategy is profitable; below 1.0 means it loses money.',
    body: `
## Interpretation
- **< 1.0** — losing strategy
- **1.0 – 1.3** — weak edge, easily killed by costs
- **1.3 – 1.8** — solid retail strategy
- **1.8 – 2.5** — strong
- **> 2.5** — exceptional, often a sign of overfit if backtest sample is small

## Formula
\`Profit Factor = Σ(winning trades) / |Σ(losing trades)|\`

## Caveat
Profit factor doesn't tell you about consistency. A strategy with one massive winner and 99 small losers can show profit factor 1.5 — and you'd need iron nerves to trade it. Pair it with win rate and Sharpe.
    `,
    related: ['win-rate', 'sharpe-ratio', 'expectancy'],
    linkedStrategies: [],
  },
  {
    slug: 'win-rate',
    title: 'Win Rate',
    category: 'metric',
    excerpt: 'Win rate is the percentage of trades that close in profit — important but easily misleading without payoff ratio context.',
    definition: 'Win rate is the number of profitable trades divided by total trades. A 60% win rate sounds good but means little without knowing the average win vs average loss.',
    body: `
## The win-rate trap
A 90% win rate sounds impressive, but if your wins average $10 and your losses average $200, you have a losing system. Always pair win rate with the **payoff ratio** (avg win / avg loss).

## Win rate × payoff
A strategy needs: \`win_rate × avg_win > (1 − win_rate) × avg_loss\`

Examples that break even:
- 70% win rate with 1:2 payoff (wins half the size of losses) = breakeven
- 30% win rate with 1:3 payoff (wins 3× losses) = profitable
- 50% win rate with 1:1 payoff = breakeven

## Trend vs reversion
Trend strategies typically have win rates of 30–45% but big payoff ratios (3:1+). Mean-reversion strategies have higher win rates (55–70%) with smaller payoff ratios. Both can be profitable.
    `,
    related: ['profit-factor', 'expectancy', 'sharpe-ratio'],
    linkedStrategies: [],
  },
  {
    slug: 'risk-management',
    title: 'Risk Management',
    category: 'concept',
    excerpt: 'Risk management is the discipline of sizing positions and placing stops so that no single trade — or string of losses — can ruin your account.',
    definition: 'Risk management is the practice of controlling how much capital is exposed on any single trade. The two main levers are position size and stop-loss placement. The most-cited rule is "never risk more than 1–2% of your account on any single trade."',
    body: `
## The 1% rule
Risk no more than 1% of your account per trade. With a 50% win rate and 1:2 payoff, you can survive 14 consecutive losses (not unheard of) and still have 87% of your account.

## Position sizing formula
\`position_size = (account × risk%) / (entry_price − stop_loss_price) × pip_value\`

For XAUUSD with $10,000 account, 1% risk, 200-pip stop:
\`position_size = $100 / (200 × $1) = 0.5 lots\`

Use our [position size calculator](/tools/position-size-calculator).

## Volatility scaling
Static stops break under different market regimes. ATR-based stops adapt — see [ATR Trend Follow](/strategies/atr-trend-follow).

## Drawdown is the constraint
A 1% per-trade risk plus 14 consecutive losses = 13% drawdown. Going to 2% risk and 14 losses = 25% drawdown — psychologically much harder to recover from.
    `,
    related: ['drawdown', 'position-sizing', 'kelly-criterion', 'stop-loss'],
    linkedStrategies: [],
  },
  {
    slug: 'position-sizing',
    title: 'Position Sizing',
    category: 'concept',
    excerpt: 'Position sizing converts risk percentage into actual lot sizes — the math that makes risk management real.',
    definition: 'Position sizing is the calculation that turns "I want to risk 1% of my account" into a specific number of lots, contracts, or units. It depends on account size, risk percentage, distance to stop, and the per-pip value of the instrument.',
    body: `
## Formula
\`lots = (account_balance × risk_pct) / (stop_loss_pips × pip_value_per_lot)\`

## Per-pip values (Exness micro account, 0.01 lot)
| Symbol | Pip value |
|---|---|
| EURUSD | $0.10 |
| GBPUSD | $0.10 |
| XAUUSD | $0.10 (per 0.1 move) |
| BTCUSD | $0.10 (per $1 move) |

## Calculator
Use our [position size calculator](/tools/position-size-calculator) — enter account size, risk %, and stop distance, and it returns lot size for any supported symbol.

## Why traders skip this
Lot sizes look small (e.g., 0.07 lots) and tempt traders to round up. Don't. The asymmetry of [drawdown recovery](/glossary/drawdown) makes oversized positions the #1 account killer.
    `,
    related: ['risk-management', 'drawdown', 'kelly-criterion', 'pip'],
    linkedStrategies: [],
  },
  {
    slug: 'pip',
    title: 'Pip',
    category: 'concept',
    excerpt: "A pip is the smallest standard price increment for a trading instrument — usually the 4th decimal for forex, $0.01 for gold.",
    definition: 'A "pip" (percentage in point) is the smallest standard increment in a quoted price. For most forex pairs (EURUSD, GBPUSD), one pip is 0.0001. For pairs with JPY, it is 0.01. For gold (XAUUSD), one pip is typically $0.10. Brokers sometimes quote a "fractional pip" or "pipette" at one more decimal.',
    body: `
## Why pips exist
Pips standardise small price moves so traders can talk in whole numbers. "Stop at 30 pips" is clearer than "stop at $0.0030 below entry."

## Pip values by symbol (1 standard lot)
| Symbol | Pip size | Pip value (1 lot) |
|---|---|---|
| EURUSD | 0.0001 | $10 |
| USDJPY | 0.01 | $10 (when JPY/USD ~ 100) |
| XAUUSD | 0.10 | $10 |
| BTCUSD | 1.00 | $1 |

## Pipettes
A "pipette" is 1/10 of a pip — the 5th decimal in a forex pair (or 3rd in a JPY pair). Many MT5 brokers quote prices to the pipette for finer execution.
    `,
    related: ['lot-size', 'position-sizing', 'spread'],
    linkedStrategies: [],
  },
  {
    slug: 'lot-size',
    title: 'Lot Size',
    category: 'concept',
    excerpt: 'Lot size is the standard unit of trade size — 1 lot is 100,000 base currency units in forex.',
    definition: 'A lot is the standardised unit of size in forex and CFD trading. One standard lot is 100,000 units of the base currency. A mini lot is 0.1 (10,000 units), a micro lot is 0.01 (1,000 units), and most brokers support down to 0.01.',
    body: `
## Lot sizes
| Lot | Size | Pip value (EURUSD) |
|---|---|---|
| Standard | 1.00 | $10 / pip |
| Mini | 0.10 | $1 / pip |
| Micro | 0.01 | $0.10 / pip |

## Why micro lots matter
Most retail traders should use micro lots. With a $1,000 account and 1% risk per trade, you can take fractional positions without overexposing.

## Pine Script note
Pine Script's \`strategy.entry()\` accepts \`qty\` in contracts, not lots — multiply by 100,000 for forex.
    `,
    related: ['pip', 'position-sizing', 'leverage'],
    linkedStrategies: [],
  },
  {
    slug: 'backtesting',
    title: 'Backtesting',
    category: 'concept',
    excerpt: 'Backtesting runs a strategy on historical data to estimate how it would have performed before risking real money.',
    definition: 'Backtesting is the process of running a trading strategy against historical price data to evaluate its performance. The output is a performance summary (return, win rate, drawdown, Sharpe) and a trade-by-trade log.',
    body: `
## What backtesting tells you
- Whether the strategy has any edge at all (profit factor > 1.0)
- How it behaves in different market regimes (uptrend, range, crash)
- The realistic drawdown to expect
- Whether the parameters are robust or curve-fit to one specific period

## Pitfalls
- **Overfitting** — tuning parameters until the backtest looks great. The strategy then fails on live data.
- **Look-ahead bias** — accidentally using data that wouldn't have been available in real time.
- **Survivorship bias** — testing on assets that exist today; ignoring delisted ones.
- **No costs modelled** — leaving out spreads, slippage, swaps, and commissions.

## Walk-forward analysis
Train on data from 2020–2022, test on 2023, advance a year, repeat. Walk-forward is harder to fool than a single in-sample optimisation.

PineForge backtests every strategy on real OHLC data with realistic spreads. See our [backtest engine](/backtest).
    `,
    related: ['walk-forward', 'overfitting', 'sharpe-ratio', 'profit-factor'],
    linkedStrategies: [],
  },
  {
    slug: 'overfitting',
    title: 'Overfitting',
    category: 'concept',
    excerpt: "Overfitting is when a strategy is tuned so tightly to historical data that it fails on live markets. The #1 killer of backtested strategies.",
    definition: "Overfitting is the practice of optimising strategy parameters until the backtest looks great, only for the strategy to fail on out-of-sample or live data. The strategy has memorised the past instead of learning a generalisable edge.",
    body: `
## Signs your strategy is overfit
- Parameters are oddly specific (EMA period 17 and 43, not 14 and 50)
- Win rate is unusually high (>75%)
- Profit factor > 3.0 on a small trade count
- Strategy uses many filters that "fix" small periods of underperformance
- Backtest looks perfect but live results don't match

## How to avoid it
1. **Walk-forward analysis** — optimise on one period, test on the next, advance, repeat.
2. **Out-of-sample reserve** — set aside the most recent 20% of data and never look at it during optimisation.
3. **Simplicity bias** — fewer parameters always beats more.
4. **Cross-asset robustness** — if it only works on one symbol, it's probably curve-fit.
5. **Live forward test** — paper-trade for 30+ days before risking real capital.

## The bitter truth
Most strategies that look amazing in backtest are overfit. A strategy with profit factor 1.4 across multiple symbols and timeframes is more trustworthy than one with profit factor 3.0 on a single optimised configuration.
    `,
    related: ['backtesting', 'walk-forward', 'sharpe-ratio'],
    linkedStrategies: [],
  },
  {
    slug: 'walk-forward',
    title: 'Walk-Forward Analysis',
    category: 'concept',
    excerpt: 'Walk-forward analysis tests a strategy by optimising on one window and testing on the next — repeated rolling forward through history.',
    definition: 'Walk-forward analysis is a backtesting methodology where the strategy is repeatedly optimised on an in-sample window, tested on the immediately following out-of-sample window, and the windows are rolled forward through history. The aggregate of all out-of-sample results is the realistic performance estimate.',
    body: `
## How it works
1. Split history into many overlapping windows (e.g. 2 years training + 6 months test).
2. Optimise parameters on the training window.
3. Apply those parameters to the test window — record the result.
4. Roll forward 6 months, repeat.
5. The concatenation of all test windows is the walk-forward equity curve.

## Why it matters
A normal backtest is a one-shot optimisation — you only know how the strategy did with hindsight-tuned parameters. Walk-forward simulates the realistic process: you didn't know the future when you set the parameters.

## What to look for
- **Walk-forward efficiency (WFE)** — out-of-sample return / in-sample return. WFE > 60% is acceptable; > 80% is excellent.
- **Stability of parameters across windows** — if optimal length jumps from 9 to 47 every six months, the strategy isn't robust.
    `,
    related: ['backtesting', 'overfitting', 'sharpe-ratio'],
    linkedStrategies: [],
  },
  {
    slug: 'breakout',
    title: 'Breakout',
    category: 'concept',
    excerpt: 'A breakout is a price move beyond a defined level (e.g. a recent high) that signals a new trend or continuation.',
    definition: "A breakout is when price decisively moves outside a defined price level — typically a recent N-bar high or low, a chart pattern boundary, or a Bollinger Band. Breakouts are taken as signals that a new trending regime is starting.",
    body: `
## Donchian breakouts
The most-quoted breakout strategy is the Donchian channel: buy when price closes above the highest high of the last N bars (typically 20–55), exit on the lowest low of the last M bars. See [Donchian Breakout](/strategies/donchian-breakout).

## False breakouts
Most breakouts fail. The cost is small — exit on a tight stop — but the rare winners are huge. Donchian breakouts have win rates of 30–40% but profit factors of 1.5–2.0 thanks to outsized winners.

## Volatility filters
Trade only breakouts that fire when ATR is rising. Quiet markets produce false breakouts; expanding volatility tends to mark genuine regime shifts.
    `,
    related: ['donchian-channel', 'atr', 'volatility', 'momentum'],
    linkedStrategies: ['donchian-breakout', 'squeeze-breakout'],
  },
  {
    slug: 'mean-reversion',
    title: 'Mean Reversion',
    category: 'concept',
    excerpt: 'Mean reversion strategies bet that prices stretched far from a moving average will snap back — works in range-bound markets, fails in strong trends.',
    definition: "Mean reversion is the assumption that prices oscillate around a long-term mean. When price moves significantly above or below that mean, mean-reversion strategies enter expecting a return. Common implementations include RSI buy-the-oversold, Bollinger Band reversion, and pairs trading.",
    body: `
## When mean reversion works
Range-bound forex pairs in quiet sessions are the natural habitat. EUR/USD in mid-summer, USD/CHF most of the time, AUD/JPY between central bank meetings.

## When it fails
Strong trends destroy mean reversion. Bitcoin in a parabolic move, gold during a flight-to-safety rally, indices in a Fed pivot. The asset can stay "overbought" for months.

## Filters that help
- ADX < 25 — only trade in non-trending conditions
- Bollinger Band width contracting — only trade in low-volatility ranges
- Time-of-day filters — many pairs mean-revert in Asian session, trend in NY session

See [RSI Mean Reversion](/strategies/rsi-mean-reversion) and [Bollinger Band Reversion](/strategies/bollinger-bands).
    `,
    related: ['trend-following', 'rsi', 'bollinger-bands', 'adx'],
    linkedStrategies: ['rsi-mean-reversion', 'bollinger-bands'],
  },
  {
    slug: 'trend-following',
    title: 'Trend Following',
    category: 'concept',
    excerpt: "Trend following is the strategy of buying assets that are going up and selling assets that are going down — counterintuitively, the most-profitable systematic style for retail traders.",
    definition: "Trend following is a class of strategies that enter in the direction of an established trend and exit when the trend reverses. Implementations include moving-average crossovers, breakouts of N-bar highs, and momentum filters. Trend following has the lowest win rate of any major strategy class but historically the highest expectancy.",
    body: `
## The trend-follower's edge
Win rates of 30–45%, profit factors of 1.5–2.5, and Sharpe ratios of 0.7–1.5 — pedestrian numbers individually, but extraordinary when applied across a basket of uncorrelated markets.

## The bitter pill
Most trend-following strategies have **long, painful drawdowns** that test conviction. The 2018 grind, the 2020 chop before COVID — these periods kill discretionary trend-followers. Systematic ones (a bot) sit through them.

## Common implementations
- [EMA Crossover](/strategies/ema-crossover) — fast/slow MA
- [Triple EMA Trend](/strategies/triple-ema) — alignment of three MAs
- [ATR Trend Follow](/strategies/atr-trend-follow) — volatility-adapted exits
- [Donchian Breakout](/strategies/donchian-breakout) — N-bar high

## Markets where it shines
Commodities (gold, oil), indices (S&P, Nasdaq), and major forex pairs. Less effective on mean-reverting pairs like EUR/CHF.
    `,
    related: ['mean-reversion', 'momentum', 'crossover', 'breakout'],
    linkedStrategies: ['ema-crossover', 'sma-crossover', 'triple-ema', 'atr-trend-follow'],
  },
];

export default glossary;

export function getGlossaryBySlug(slug) {
  return glossary.find((g) => g.slug === slug);
}
