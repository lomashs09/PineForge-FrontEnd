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
    excerpt: 'MACD shows the relationship between two EMAs of price — one of the most widely-used trend and momentum indicators in technical analysis.',
    definition: "The Moving Average Convergence Divergence indicator plots the difference between a 12-period EMA and a 26-period EMA (the MACD line) alongside a 9-period EMA of that difference (the signal line). The gap between the two lines is shown as a histogram. Together they identify trend direction, momentum strength, and shifts in either.",
    body: `
## How MACD is constructed
MACD has three components and one historical author. Gerald Appel introduced it in the late 1970s, and the default parameters he picked — 12, 26, 9 — have stuck for half a century almost unchanged.

- **MACD line** — \`12 EMA(close) − 26 EMA(close)\`. Positive when fast EMA is above slow (uptrend bias); negative when below (downtrend bias).
- **Signal line** — \`9 EMA(MACD line)\`. Smoother version of the MACD line, used as a crossover trigger.
- **Histogram** — \`MACD line − Signal line\`. Visualises whether momentum is accelerating (growing bars) or decelerating (shrinking bars).

The defaults are designed for daily charts, but they work reasonably well across timeframes. Faster pairs (5, 13, 5) are sometimes used for intraday; slower pairs (19, 39, 9) for weekly trend confirmation.

## The four MACD signals
MACD generates four distinct signals — each with different reliability and best-use cases.

### 1. Signal-line crossover
The most-quoted signal. The MACD line crosses above the signal line → bullish; below → bearish. Late by design (you're using a 9-period smoothed version of an already-lagging moving average), so it filters noise but misses early entry.

### 2. Zero-line crossover
The MACD line itself crosses above zero (12 EMA crosses above 26 EMA) → confirmed uptrend; below → confirmed downtrend. Slower than the signal-line cross but a stronger trend confirmation.

### 3. Histogram divergence
Price makes a new high, but the MACD histogram makes a *lower* high. Momentum is fading even though price isn't yet — often a leading indicator of a reversal. The reverse (lower price low + higher histogram low) is a bullish divergence. Divergence is the most-traded MACD signal among discretionary traders and the easiest to misread — only act on it after a confirming price action.

### 4. Histogram acceleration
When the histogram bars are growing in the direction of the trend, momentum is accelerating. Shrinking bars while price still moves favourably warns the trend is running out of steam. Useful as a position-management tool rather than an entry signal.

## Why the 12/26/9 defaults
The three numbers approximate two and four trading weeks plus 1.5 weeks of smoothing. There's nothing magical about them — they're a reasonable compromise on daily charts of major US equities, which is where Appel was working. On other instruments and timeframes the optimal values shift, and any robust strategy should test alternatives via [walk-forward analysis](/glossary/walk-forward) before committing.

That said, three reasons to *keep* the defaults:
1. **Reflexivity** — millions of traders watch 12/26/9 charts. Crossovers there move price simply because so many people react to them.
2. **Out-of-sample stability** — defaults that have survived 50 years of public trading are unlikely to be curve-fit. Custom values that beat them by 5% in backtest usually fail in live trading.
3. **Comparability** — every screener, every TradingView script, every MetaTrader template assumes 12/26/9. Custom values become a maintenance burden.

## MACD in Pine Script
\`\`\`pinescript
//@version=5
strategy("MACD Crossover", overlay=true)

[macdLine, signalLine, histLine] = ta.macd(close, 12, 26, 9)

// Long on bullish signal-line crossover above the zero line (extra filter)
if ta.crossover(macdLine, signalLine) and macdLine > 0
    strategy.entry("Long", strategy.long)

// Exit on bearish crossover
if ta.crossunder(macdLine, signalLine)
    strategy.close("Long")
\`\`\`

The \`macdLine > 0\` filter is the difference between a textbook MACD strategy (mediocre) and a deployable one. Trading only crossovers in the direction of the underlying trend is the most reliable MACD edge — it doubles win rate at the cost of a few entries.

## MACD vs RSI
MACD and [RSI](/glossary/rsi) get confused because both are "momentum oscillators," but they answer different questions.

- **MACD** is *unbounded* and tells you about the relationship between fast and slow trends. It's a trend-following tool with momentum colour.
- **RSI** is *bounded 0-100* and tells you how stretched price is from its recent average. It's a mean-reversion tool with overbought/oversold thresholds.

You can't directly compare a MACD reading of 1.2 across instruments — it depends on price scale. RSI is comparable: 70 means the same thing on EUR/USD as on Bitcoin. Many trend-following systems use both: MACD for direction, RSI for entry timing.

## Common MACD mistakes
- **Trading every crossover.** Without a trend filter, MACD whipsaws in ranging markets. Add a 200 EMA filter or an [ATR](/glossary/atr) volatility check.
- **Reading divergence too early.** Divergence can persist for weeks before reversing. Always wait for confirming price action — a swing high break, a candle close, anything that proves the move is real.
- **Optimising the parameters.** Default 12/26/9 is rarely beaten in walk-forward. Time spent re-tuning would be better spent building entry filters.
- **Ignoring the histogram.** The histogram leads the signal-line crossover by 1-3 bars. Watching the bars shrink in real time gives you a head start on the eventual cross.

## MACD in PineForge strategies
PineForge ships several strategies that use MACD as a primary or filter signal. See [EMA Crossover](/strategies/ema-crossover) for a related implementation, [Triple EMA](/strategies/triple-ema) for a multi-MA trend confirmation, and [Momentum V7](/strategies) for a MACD + ADX + volume hybrid.
    `,
    faqs: [
      {
        q: 'What does MACD stand for?',
        a: "MACD stands for Moving Average Convergence Divergence. It refers to how two exponential moving averages — typically the 12-period and 26-period EMA — converge (move closer) and diverge (move apart) over time, with the gap plotted as the indicator's primary line.",
      },
      {
        q: 'What are the best MACD settings?',
        a: "The default 12, 26, 9 settings work well across most markets and timeframes and are the values nearly every other trader watches — which gives them reflexive significance. Faster settings like 5, 13, 5 suit intraday scalping; slower settings like 19, 39, 9 suit weekly trend confirmation. Only deviate from defaults after walk-forward analysis confirms the change is robust.",
      },
      {
        q: 'How do I trade a MACD crossover?',
        a: 'Wait for the MACD line to cross above the signal line for a long entry, or below for a short. The most reliable filter is to only take crossovers when the MACD line is above zero (uptrend) for longs, or below zero (downtrend) for shorts. This single rule typically doubles win rate vs. trading every crossover blind.',
      },
      {
        q: 'What is MACD divergence?',
        a: "MACD divergence happens when price makes a new high but the MACD histogram makes a lower high — momentum is fading even though price hasn't yet rolled over. Bullish divergence is the reverse: lower price low, higher histogram low. Divergence is a leading reversal signal but unreliable on its own. Always wait for confirming price action like a swing-high break or a strong candle close before acting.",
      },
      {
        q: 'Is MACD better than RSI?',
        a: "Neither is better — they measure different things and complement each other. MACD captures trend direction and momentum acceleration with no fixed range. RSI tells you how overbought or oversold price is on a 0-100 scale. Many systematic strategies use MACD for trend direction and RSI for entry timing within that trend.",
      },
      {
        q: 'Does MACD work on cryptocurrency?',
        a: "Yes, with adjustments. Crypto is more volatile and trends harder than forex or equities, so the default 12/26/9 generates more whipsaws on lower timeframes. Either move to a higher timeframe (4H or daily) or pair MACD with a volatility filter that suppresses signals when ATR is contracting. Bitcoin and Ethereum on the daily chart respond well to standard MACD trend logic.",
      },
    ],
    related: ['ema', 'rsi', 'momentum', 'crossover', 'walk-forward'],
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
    excerpt: 'Profit factor is gross winning trades divided by gross losing trades — the single quickest test of whether a strategy has any real edge at all.',
    definition: "Profit factor is the sum of all winning trades' profits divided by the absolute sum of all losing trades' losses. A value above 1.0 means the strategy is profitable; below 1.0 means it loses money. It is the most-used screening metric in algorithmic trading because it answers a yes-or-no question — does this thing have an edge — in a single number.",
    body: `
## Formula
\`Profit Factor = Σ(winning trades) / |Σ(losing trades)|\`

If a strategy wins $4,200 across all winners and loses $2,800 across all losers, the profit factor is \`4200 / 2800 = 1.5\`. Every dollar lost is paid back with $1.50 of winnings.

## How to interpret a profit factor

| Profit factor | What it means |
|---|---|
| < 1.0 | Losing strategy. Stop. |
| 1.0 – 1.3 | Weak edge. Almost certainly killed once you add realistic spreads, slippage, and swap costs. |
| 1.3 – 1.8 | Solid retail strategy. Most published trend-following systems land here. |
| 1.8 – 2.5 | Strong. If verified by walk-forward, deployable with confidence. |
| 2.5 – 3.5 | Exceptional. Verify trade count and out-of-sample results before believing it. |
| > 3.5 | Almost always overfit. Run [walk-forward analysis](/glossary/walk-forward) before trusting any strategy in this range. |

A profit factor of 1.5 is the rough industry baseline for a retail strategy you'd actually deploy. Below that, costs eat the edge.

## Profit factor by strategy type
Different strategy classes naturally produce different profit factors. Understanding the typical range for your style stops you from chasing impossible numbers.

- **Trend following** — 1.5 to 2.2 with 30-45% win rate. Big winners, many small losers, profit comes from the right tail.
- **Mean reversion** — 1.3 to 1.8 with 55-70% win rate. Lots of small wins, rare large losses when the mean fails to revert.
- **Breakout** — 1.4 to 1.9 with 35-45% win rate. Similar profile to trend-following but with shorter trade durations.
- **High-frequency / scalping** — 1.1 to 1.4 — costs eat most of the edge, only viable with elite execution.
- **Discretionary swing** — claimed numbers are usually 2.0+, real ones rarely exceed 1.6 once survivorship bias is removed.

## Profit factor vs win rate
Profit factor and [win rate](/glossary/win-rate) measure two different things and you need both to evaluate a strategy honestly. A 90% win rate sounds impressive — but if the average win is $10 and the average loss is $200, the profit factor is below 1.0 and you're losing money.

The relationship: **profit factor = (win rate × avg win) / ((1 − win rate) × avg loss)**.

| Win rate | Avg win / avg loss | Profit factor |
|---|---|---|
| 70% | 0.5 | 1.17 |
| 50% | 1.0 | 1.00 |
| 40% | 2.0 | 1.33 |
| 30% | 3.0 | 1.29 |
| 30% | 5.0 | 2.14 |

Trend-following strategies live in the bottom rows; mean-reversion strategies in the top rows. Both can be profitable.

## What profit factor doesn't tell you
The number is a single average — it hides the distribution that produced it.

- **One huge winner can carry the whole metric.** A strategy with 99 small losers and one $50k winner can show profit factor 1.8. Live, you'd quit before the winner ever arrived.
- **It's blind to drawdown.** A profit factor of 1.6 with a 50% max [drawdown](/glossary/drawdown) is psychologically untradable.
- **It says nothing about path dependence.** Profit factor 1.5 from steady gains looks identical to profit factor 1.5 from three-month flat periods punctuated by huge runs.
- **It's volatile in small samples.** A 30-trade backtest with profit factor 2.0 carries massive uncertainty. The same strategy across 500 trades at profit factor 1.5 is far more believable.

Always pair profit factor with win rate, max drawdown, and trade count.

## How to improve a strategy's profit factor
Three levers, in order of typical impact.

1. **Cut the worst losers** — adding a volatility filter or trend regime filter often removes the biggest losses without sacrificing winners. Profit factor jumps even though gross profit barely moves.
2. **Let winners run** — trailing stops and ATR-based exits keep winners larger than losers. The payoff ratio improves; profit factor follows.
3. **Reduce trading frequency** — many strategies show their best profit factor when trading half as often. Removing marginal setups removes marginal losses.

Counter-intuitively, *adding entry filters* is usually safer than tweaking exits. Bad entries kill profit factor faster than imperfect exits do.

## Profit factor in PineForge
Every backtest report in [PineForge](/backtest) shows profit factor alongside Sharpe, Sortino, max drawdown, and win rate. Strategies under PF 1.3 are flagged in the UI. We recommend treating PF 1.5 as the floor for deployment and verifying with [walk-forward analysis](/glossary/walk-forward) before going live.
    `,
    faqs: [
      {
        q: 'What is a good profit factor for a trading strategy?',
        a: 'For most retail strategies, a profit factor between 1.5 and 2.0 is considered good. Below 1.3 the edge is usually killed by spreads and slippage. Above 2.5 is exceptional and worth scrutinising for overfitting — verify it survives walk-forward analysis on data the optimiser never saw.',
      },
      {
        q: 'How do I calculate profit factor from a backtest?',
        a: 'Sum the absolute profit of every winning trade, sum the absolute loss of every losing trade, and divide the first by the second. Most platforms (TradingView, MetaTrader, PineForge) compute it automatically. The formula is identical regardless of asset class, timeframe, or position sizing.',
      },
      {
        q: 'Is profit factor better than win rate?',
        a: "Neither is better — they measure different things and you need both. A 90% win rate with tiny wins and large losses produces profit factor below 1.0. A 30% win rate with 5:1 payoff produces profit factor above 2.0. Always read them together, alongside max drawdown and trade count.",
      },
      {
        q: 'Why do my live trading results show a lower profit factor than my backtest?',
        a: 'Three usual culprits: backtests often underestimate spreads and slippage; commissions and swaps may not have been modelled; and the strategy may be overfit to historical data so it does worse on data the optimiser never saw. Always run walk-forward analysis and add 30-50% to your modelled spread before believing a backtest.',
      },
      {
        q: 'What profit factor do professional trading firms aim for?',
        a: "Systematic hedge funds typically run portfolios of strategies where each individual strategy has profit factor 1.4-1.8 — but the portfolio aggregates to higher Sharpe through diversification, not by chasing individual strategies with extreme profit factors. A portfolio of ten weakly-correlated PF 1.5 strategies is more robust than one PF 3.0 strategy.",
      },
      {
        q: 'Can profit factor be negative?',
        a: "No. Profit factor is by definition non-negative because it divides absolute profits by absolute losses. The lowest possible value is 0 (every trade lost) and there is no upper bound. A losing strategy has profit factor between 0 and 1.0; a winning strategy is above 1.0.",
      },
    ],
    related: ['win-rate', 'sharpe-ratio', 'expectancy', 'drawdown', 'walk-forward'],
    linkedStrategies: [],
  },
  {
    slug: 'win-rate',
    title: 'Win Rate',
    category: 'metric',
    excerpt: 'Win rate is the percentage of trades that close in profit — useful, but dangerously misleading without the payoff ratio alongside it.',
    definition: 'Win rate is the number of profitable trades divided by the total number of trades, expressed as a percentage. A strategy with 60 winners out of 100 trades has a 60% win rate. The number is intuitive but never sufficient on its own — a high win rate with a poor payoff ratio is a losing strategy.',
    body: `
## The win-rate trap
A 90% win rate sounds impressive. But if your average win is $10 and your average loss is $200, you have a losing system: \`0.9 × $10 = $9\` per winning trade against \`0.1 × $200 = $20\` per losing trade — net expectancy −$11. Strategies marketed on win rate alone are almost always martingale-style averaging-down systems that look perfect until the one bad trade wipes the account.

The fix: always read win rate together with the **payoff ratio** (average win / average loss).

## Breakeven win rate by payoff ratio
The mathematical condition for profitability is:

\`win_rate × avg_win > (1 − win_rate) × avg_loss\`

Solving for the breakeven win rate at different payoff ratios:

| Payoff (avg win ÷ avg loss) | Breakeven win rate |
|---|---|
| 0.5 (wins half size of losses) | 67% |
| 1.0 (wins same as losses) | 50% |
| 1.5 | 40% |
| 2.0 | 33% |
| 3.0 | 25% |
| 5.0 | 17% |

Above the breakeven row your strategy makes money; below it loses. A strategy with 30% win rate at 3:1 payoff is more profitable than 65% win rate at 0.5 payoff.

## Win rate by strategy class
Different strategy classes naturally cluster at different win-rate ranges. Knowing the typical band for your style stops you from over-engineering toward an unrealistic number.

- **Trend following** — 30-45% win rate, 2.5-4x payoff. Most trades stop out small; the few that catch big moves carry the year.
- **Breakout** — 35-45% win rate, 2-3x payoff. Similar profile, slightly higher win rate because trend confirmation filters reduce false starts.
- **Mean reversion** — 55-70% win rate, 0.7-1.2x payoff. Many small wins as price snaps back to the mean, occasional large losses when it doesn't.
- **Scalping / range trading** — 60-75% win rate, 0.5-0.9x payoff. Profit factor depends on execution costs.
- **Options selling (premium-collection)** — 80-90% win rate, 0.1-0.3x payoff. Looks beautiful in equity curve but one tail event eats years of premium.

If your trend-following backtest shows a 70% win rate, double-check for look-ahead bias. It almost certainly has one.

## Why traders chase win rate (and shouldn't)
A high win rate feels good. Every trade that closes green reinforces the strategy. Long strings of wins create false confidence; long strings of losses (normal in a 35% win-rate trend system) create false despair. Most retail traders abandon perfectly good trend strategies during a routine losing streak — not because the math broke, but because their psychology did.

Two ways to inoculate against this:
1. **Plan for the maximum streak.** A 35% win-rate strategy will see 10 consecutive losses about once every 240 trades. Knowing this in advance makes it survivable.
2. **Track expectancy, not streaks.** Expectancy = (win_rate × avg_win) − ((1 − win_rate) × avg_loss). Positive expectancy + adequate sample size = profitable. Streaks are noise.

## Improving win rate without breaking the strategy
Adding filters that remove low-probability setups is the cleanest way. The trick: every filter you add removes losing trades *and* winning trades. You want filters that remove proportionally more losers than winners.

- **Trend regime filter** (e.g. only trade longs above the 200 EMA) — removes counter-trend setups, typically lifts win rate by 5-10 percentage points.
- **Volatility filter** (only trade when ATR is rising) — improves win rate on breakouts.
- **Time-of-day filter** — many forex pairs mean-revert in Asian hours and trend in NY hours. Restricting to one regime cleans up the win-rate distribution.

Avoid adding filters that just memorise past unfavourable conditions ("don't trade Tuesdays in March"). They lift in-sample win rate and fail in walk-forward.

## Win rate and position sizing
Win rate determines the maximum bet size you can survive. The Kelly criterion formalises this:

\`Kelly fraction = win_rate − ((1 − win_rate) / payoff)\`

For a 50% win-rate strategy with 1.5x payoff: \`0.5 − (0.5 / 1.5) = 0.17\`. Full Kelly says risk 17% of equity per trade — way too high in practice. Most professionals use **fractional Kelly** (1/4 to 1/2 of the formula's output), which is why "risk 1-2% per trade" is the retail rule of thumb.

A low win rate (30-40%) tolerates much smaller per-trade risk than a high win rate at the same payoff, simply because long losing streaks are more likely.

## Win rate in PineForge
Every PineForge backtest reports win rate alongside [profit factor](/glossary/profit-factor), payoff ratio, and trade count. Use the trio together — never one number in isolation. See our [risk management](/glossary/risk-management) guide for how win rate flows into [position sizing](/glossary/position-sizing).
    `,
    faqs: [
      {
        q: 'What is a good win rate for a trading strategy?',
        a: 'There is no single number — it depends on payoff ratio. A 30% win rate with 3:1 payoff outperforms a 65% win rate with 0.5 payoff. The right question is whether your win rate is above the breakeven for your payoff ratio: above 33% with 2:1 payoff, above 50% with 1:1 payoff, above 67% with 1:2 payoff.',
      },
      {
        q: 'Why do trend-following strategies have low win rates?',
        a: "Trend strategies stop out quickly on every false start, then ride the rare real trends to outsized winners. The structure is many small losses and a few big wins by design. A trend-following strategy with a 70% win rate is almost always overfit or has look-ahead bias — the math of trend distributions makes that win rate impossible without changing the strategy class.",
      },
      {
        q: 'Can I be profitable with a 30% win rate?',
        a: "Yes — most professional trend-followers and CTAs run at 30-45% win rates. The key is the payoff ratio: average win must be at least 2.5-3x average loss. That requires letting winners run with trailing stops while cutting losers fast — psychologically hard but mathematically straightforward. The 30% win rate is the trend-follower's edge, not their handicap.",
      },
      {
        q: 'How does win rate affect position sizing?',
        a: 'Lower win rates require smaller position sizes because long losing streaks become more likely. The Kelly criterion captures this: optimal bet fraction = win_rate − ((1 − win_rate) / payoff). Most retail traders should use fractional Kelly (1/4 to 1/2 of the formula) and cap risk at 1-2% per trade — the rule of thumb that keeps you alive through statistically inevitable losing streaks.',
      },
      {
        q: 'How many trades do I need for a win rate to be statistically meaningful?',
        a: "At least 100 trades for a rough estimate, 300+ for confidence. With only 30 trades a win rate of 60% has roughly ±18 percentage points of uncertainty — meaning the true win rate could be anywhere from 42% to 78%. Always check trade count alongside the headline number.",
      },
      {
        q: 'Is a high win rate a sign of overfitting?',
        a: "Often, yes. If a backtest shows 80%+ win rate on a strategy class that normally runs at 40-50%, the most likely explanation is overfitting or look-ahead bias. Run walk-forward analysis on the strategy. If the out-of-sample win rate drops by more than 15 percentage points, the in-sample number was a fantasy.",
      },
    ],
    related: ['profit-factor', 'expectancy', 'sharpe-ratio', 'drawdown', 'kelly-criterion'],
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
    excerpt: 'Walk-forward analysis tests a strategy by optimising on one window and testing on the next — repeated rolling forward through history. The most honest backtest you can run.',
    definition: 'Walk-forward analysis is a backtesting methodology where the strategy is repeatedly re-optimised on an in-sample window, tested on the immediately following out-of-sample window, and the windows are rolled forward through history. The concatenation of every out-of-sample test segment is the realistic performance estimate — the closest thing to live trading you can get from historical data.',
    body: `
## Why a single backtest lies
A normal backtest is a one-shot optimisation. You see all the data, tune parameters until the equity curve looks great, and then claim you "would have made" 47% last year. The problem: you used the future to set the past. In live trading you don't get that privilege — the parameters you pick on January 1 have to survive the rest of the year unmodified.

Walk-forward analysis closes this gap. It simulates the only realistic process: tune on what you already know, deploy, see how it does on data you've never seen, then re-tune as new data arrives. The aggregate out-of-sample return is the *honest* number — and it's almost always lower than the in-sample backtest.

## How walk-forward works step by step
1. Split history into many overlapping windows (e.g. **24 months training + 6 months test**, advancing 6 months at a time).
2. Optimise parameters on the training window — pick the best EMA length, RSI threshold, ATR multiplier.
3. Apply those frozen parameters to the test window. Record the trades.
4. Slide the whole window forward 6 months and repeat.
5. The concatenation of every test segment is the walk-forward equity curve.

After eight years of data with the configuration above, you'll have ~12 out-of-sample test segments stitched together. That equity curve is what you should believe — not the in-sample optimisation.

## Anchored vs rolling windows
- **Rolling (sliding) walk-forward** — the training window has a fixed length and moves forward. The strategy "forgets" old data. Better for markets that change regime (crypto, indices around Fed pivots).
- **Anchored walk-forward** — the training window starts on day 1 and only ever grows. The strategy uses every piece of history available. Better when long-term statistical relationships are stable (commodities, gold).

## A worked example on XAUUSD 1H
Suppose you're building an EMA crossover for gold. You have 8 years of XAUUSD 1H data (2018–2025). Configuration:

| Parameter | Value |
|---|---|
| Training window | 2 years |
| Test window | 6 months |
| Step | 6 months |
| Optimised parameters | Fast EMA (5–20), Slow EMA (20–80), ATR stop multiplier (1.5–4.0) |

Every 6 months you re-run the grid search on the previous 24 months and apply the winner to the next 6. After 12 segments you'll find:

- **In-sample profit factor** — typically 1.8–2.4 (the optimiser cherry-picks)
- **Out-of-sample profit factor** — typically 1.2–1.6 (reality)
- **Walk-forward efficiency** — 50–70% if the strategy has a real edge

If WFE is below 40%, the strategy is mostly curve-fit. Stop trading it.

## What to measure
Three numbers matter more than the equity curve.

- **Walk-forward efficiency (WFE)** — out-of-sample return / in-sample return. WFE > 60% is acceptable; > 80% is excellent. WFE near 100% is suspicious — either the optimiser barely moved the parameters or the test window is too small.
- **Parameter stability across windows** — if the optimal fast EMA length jumps from 9 → 47 → 12 → 38 every six months, the strategy is randomly picking noise. A robust strategy has slowly-drifting optima.
- **Out-of-sample [profit factor](/glossary/profit-factor) and [drawdown](/glossary/drawdown)** — the OOS curve is what you'd actually earn. Use it for sizing decisions, not the in-sample number.

## Common mistakes
1. **Test window too small** — 1 month of OOS data isn't enough to be statistically meaningful. Minimum 3 months, ideally 6+.
2. **Re-optimising too often** — re-tuning every week means you're essentially curve-fitting to last week's noise. Typical re-tune frequency is monthly to quarterly.
3. **Look-ahead leak in the optimiser** — if your "training window" includes any data the strategy can see, you've broken the experiment. Make sure the cut-off is hard.
4. **Cherry-picking the best segment** — every walk-forward will have one segment that did exceptionally well. The aggregate is the truth, not the highlight reel.
5. **Treating WFE as the only number** — a strategy with 80% WFE but a max OOS drawdown of 45% is still untradable.

## Walk-forward vs other validation methods
- **Single backtest** — one-shot optimisation. Easy to fool, fast to run. Use only for initial idea screening.
- **Out-of-sample reserve** — set aside the last 20% of data and never look. One test, one verdict. Less data-efficient than walk-forward.
- **K-fold cross-validation** — splits data into K segments and rotates which is the test set. Used in ML; less appropriate for time-series because it can leak future data into the past.
- **Walk-forward** — the best option for time-series strategies. Slow, but it answers the only question that matters: would this have worked in real time?

## When walk-forward isn't worth it
If your strategy has zero free parameters — for example, "buy when price closes above the highest high of 20 bars" — there's nothing to optimise, so walk-forward collapses into a regular out-of-sample test. Just split your data 70/30 and verify on the holdout.

If your trade count is tiny (say, 10 trades a year), every walk-forward segment becomes statistically meaningless. Stick to longer-term backtests with confidence intervals instead.

## Walk-forward in PineForge
PineForge's [backtest engine](/backtest) supports anchored walk-forward analysis on every strategy. Pick the training and test window sizes, click run, and the platform reports per-segment metrics, walk-forward efficiency, and parameter stability across windows — all on real OHLC data with realistic spreads. See [Backtesting](/glossary/backtesting) for the broader methodology.
    `,
    faqs: [
      {
        q: 'How is walk-forward analysis different from a regular backtest?',
        a: "A regular backtest tunes parameters on the entire dataset and reports the result — which inflates returns because the optimiser used data the strategy wouldn't have known in real time. Walk-forward only ever tunes on past data and tests on the next unseen segment, so its aggregate result is what you'd realistically have earned trading live.",
      },
      {
        q: 'What is a good walk-forward efficiency (WFE)?',
        a: 'Above 60% is acceptable, above 80% is excellent. Below 40% means the strategy is mostly curve-fit — its in-sample performance does not transfer to out-of-sample data. WFE near 100% is also suspicious because it usually means the optimiser barely moved the parameters or the test window is too small to be meaningful.',
      },
      {
        q: 'How long should the training and test windows be?',
        a: 'A common starting point is 24 months training with 6 months testing for 1H or 4H strategies. For daily strategies, scale up — 4 years training, 12 months testing. The test window must be long enough to contain dozens of trades, otherwise per-segment results are statistical noise.',
      },
      {
        q: 'Anchored or rolling walk-forward — which should I use?',
        a: "Rolling for markets where regimes shift (crypto, indices around central bank pivots), because the strategy forgets old data and adapts. Anchored for markets where long-term statistical relationships are stable (gold, major forex pairs), because the longer the training set, the more reliable the parameter estimate.",
      },
      {
        q: 'Can I run walk-forward analysis in TradingView?',
        a: "TradingView's built-in strategy tester does not support walk-forward natively — it only does single-period backtests. You can simulate it manually by changing dates and re-optimising in batches, or use a platform like PineForge that automates the rolling re-optimisation across windows.",
      },
      {
        q: 'How often should I re-optimise a live strategy?',
        a: "Match the test window from your walk-forward analysis. If your walk-forward used 6-month test segments, re-tune every 6 months in production. Re-tuning more often essentially curve-fits to recent noise; re-tuning less often lets the parameters drift further from optimal as market regimes change.",
      },
    ],
    related: ['backtesting', 'overfitting', 'sharpe-ratio', 'profit-factor', 'drawdown'],
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
