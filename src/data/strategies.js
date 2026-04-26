// Curated strategy library powering /strategies/<symbol>-<strategy> pages.
//
// `appliesTo` lists symbol categories where the strategy has a real edge —
// each combo becomes a programmatic page. Adding a strategy here automatically
// generates pages for every matching symbol.

const strategies = [
  {
    slug: 'ema-crossover',
    name: 'EMA Crossover',
    family: 'trend-following',
    shortDesc:
      'Two exponential moving averages — buy when the fast crosses above the slow, exit when it crosses back.',
    longDesc:
      'The EMA crossover is the textbook trend-following strategy. A fast EMA (typically 9–13) reacts to recent price; a slow EMA (21–50) tracks the broader trend. The crossover marks a regime change. It captures large directional moves in trending markets and fails predictably in chop — making it easy to layer with a regime filter.',
    indicators: ['EMA 9', 'EMA 21'],
    timeframes: ['1h', '4h', '1d'],
    bestFor: ['Strong directional trends', 'Higher timeframes (≥1H)'],
    avoidFor: ['Tight ranges', 'Pre-news drifting'],
    appliesTo: ['commodity', 'forex', 'crypto', 'index'],
    pineCode: `//@version=5
strategy("EMA Crossover 9/21", overlay=true)

fast_ema = ta.ema(close, 9)
slow_ema = ta.ema(close, 21)

if ta.crossover(fast_ema, slow_ema)
    strategy.entry("Long", strategy.long)

if ta.crossunder(fast_ema, slow_ema)
    strategy.close("Long")`,
  },
  {
    slug: 'sma-crossover',
    name: 'SMA Crossover',
    family: 'trend-following',
    shortDesc:
      'The classic golden-cross / death-cross signal — slower than EMAs, fewer false positives.',
    longDesc:
      'The SMA crossover uses simple moving averages instead of exponential. The signal is slower to fire (good — fewer whipsaws) but slower to exit (bad — bigger giveback). The 50/200 SMA cross is the textbook "golden cross" signal used by every CNBC anchor for a reason: on daily charts of major indices, it actually works.',
    indicators: ['SMA 50', 'SMA 200'],
    timeframes: ['4h', '1d'],
    bestFor: ['Daily / 4h timeframes', 'Indices and large caps'],
    avoidFor: ['Sub-hourly intraday', 'Choppy crypto altcoins'],
    appliesTo: ['index', 'forex', 'commodity'],
    pineCode: `//@version=5
strategy("SMA Crossover 50/200", overlay=true)

fast_sma = ta.sma(close, 50)
slow_sma = ta.sma(close, 200)

if ta.crossover(fast_sma, slow_sma)
    strategy.entry("Long", strategy.long)

if ta.crossunder(fast_sma, slow_sma)
    strategy.close("Long")`,
  },
  {
    slug: 'rsi-mean-reversion',
    name: 'RSI Mean Reversion',
    family: 'mean-reversion',
    shortDesc:
      'Buy oversold, sell overbought — the simplest counter-trend strategy that still works in range-bound markets.',
    longDesc:
      'RSI mean reversion buys when RSI(14) drops below 30 and exits above 70. It fails badly in strong trends — a stock can stay overbought for weeks — so it only earns its keep on range-bound symbols or with an ADX/MA regime filter. Tighter thresholds (25/75) reduce trade count but improve win rate.',
    indicators: ['RSI 14'],
    timeframes: ['15m', '1h', '4h'],
    bestFor: ['Range-bound forex pairs', 'Quiet sessions'],
    avoidFor: ['Strong trending crypto', 'Breakout markets'],
    appliesTo: ['forex', 'commodity', 'index'],
    pineCode: `//@version=5
strategy("RSI Mean Reversion", overlay=true)

rsi_len = input.int(14, "RSI Length")
oversold = input.int(30, "Oversold Level")
overbought = input.int(70, "Overbought Level")

rsi_val = ta.rsi(close, rsi_len)

if rsi_val < oversold
    strategy.entry("Long", strategy.long)

if rsi_val > overbought
    strategy.close("Long")`,
  },
  {
    slug: 'bollinger-bands',
    name: 'Bollinger Band Reversion',
    family: 'mean-reversion',
    shortDesc:
      'Buy lower band, exit upper band — volatility-adaptive mean reversion.',
    longDesc:
      'Bollinger Bands plot two standard deviations around a 20-period SMA. Price reaching the lower band signals a statistical extreme — about 2.5% probability assuming normality. The strategy fades these extremes. Works on range-bound symbols; layer in a "no entry if bands are widening" rule to skip breakout regimes.',
    indicators: ['Bollinger Bands (20, 2σ)'],
    timeframes: ['15m', '1h', '4h'],
    bestFor: ['Mean-reverting forex', 'Quiet sessions'],
    avoidFor: ['Trending crypto', 'News spikes'],
    appliesTo: ['forex', 'commodity', 'index'],
    pineCode: `//@version=5
strategy("Bollinger Band Reversion", overlay=true)

length = input.int(20, "BB Length")
mult = input.float(2.0, "BB Multiplier")

basis = ta.sma(close, length)
dev = ta.stdev(close, length) * mult
upper = basis + dev
lower = basis - dev

if close < lower
    strategy.entry("Long", strategy.long)

if close > upper
    strategy.close("Long")`,
  },
  {
    slug: 'donchian-breakout',
    name: 'Donchian Breakout',
    family: 'breakout',
    shortDesc:
      'Buy the highest high of the last N bars — the original turtle-trader strategy.',
    longDesc:
      'Donchian breakouts buy when price closes above the N-bar high. It captures regime changes — the moment a market wakes up from a range. Fails in chop (every false breakout is a small loss) but the long tail of trending wins more than compensates. Most profitable on volatile assets like XAUUSD and crypto.',
    indicators: ['Donchian (50)', 'Donchian (25)'],
    timeframes: ['1h', '4h', '1d'],
    bestFor: ['Volatile commodities and crypto', 'Trending indices'],
    avoidFor: ['Tight ranges', 'Low-volume sessions'],
    appliesTo: ['commodity', 'crypto', 'index'],
    pineCode: `//@version=5
strategy("Donchian Breakout", overlay=true)

entry_len = input.int(50, "Entry Lookback")
exit_len = input.int(25, "Exit Lookback")

highest_high = ta.highest(high, entry_len)
lowest_low = ta.lowest(low, exit_len)

if close > highest_high[1]
    strategy.entry("Long", strategy.long)

if close < lowest_low[1]
    strategy.close("Long")`,
  },
  {
    slug: 'squeeze-breakout',
    name: 'Squeeze Breakout',
    family: 'breakout',
    shortDesc:
      'Trade the breakout of a Bollinger Band squeeze — entries only when volatility expands.',
    longDesc:
      'A "squeeze" happens when Bollinger Bands contract inside the Keltner Channel — volatility is unusually low. The strategy waits for the squeeze to release, then trades in the direction of the expansion. Filters out chop, captures the start of new trends. Works best on volatile symbols where squeezes are rare and consequential.',
    indicators: ['Bollinger Bands', 'Keltner Channel'],
    timeframes: ['1h', '4h'],
    bestFor: ['Volatility expansion regimes', 'Pre-news setups'],
    avoidFor: ['Constant-volatility crypto', 'Illiquid sessions'],
    appliesTo: ['commodity', 'crypto', 'index'],
    pineCode: `//@version=5
strategy("Squeeze Breakout", overlay=true)

length = input.int(20, "Length")
bb_mult = input.float(2.0, "BB Multiplier")
kc_mult = input.float(1.5, "KC Multiplier")

basis = ta.sma(close, length)
dev = ta.stdev(close, length)
bb_upper = basis + dev * bb_mult
bb_lower = basis - dev * bb_mult
atr = ta.atr(length)
kc_upper = basis + atr * kc_mult
kc_lower = basis - atr * kc_mult

squeeze = bb_upper < kc_upper and bb_lower > kc_lower
release = not squeeze and squeeze[1]

if release and close > basis
    strategy.entry("Long", strategy.long)

if release and close < basis
    strategy.entry("Short", strategy.short)`,
  },
  {
    slug: 'triple-ema',
    name: 'Triple EMA Trend',
    family: 'trend-following',
    shortDesc:
      'Three EMAs aligned — trade only when all three confirm the same direction.',
    longDesc:
      'The triple-EMA system uses 8/21/55 EMAs. Long entries fire only when EMA8 > EMA21 > EMA55 (full bullish stack). The triple confirmation cuts whipsaws relative to a simple crossover at the cost of later entries. Excellent on assets that trend cleanly — XAUUSD, BTC, indices.',
    indicators: ['EMA 8', 'EMA 21', 'EMA 55'],
    timeframes: ['1h', '4h', '1d'],
    bestFor: ['Strong trends', 'Reducing whipsaws'],
    avoidFor: ['Sideways markets'],
    appliesTo: ['commodity', 'crypto', 'index', 'forex'],
    pineCode: `//@version=5
strategy("Triple EMA Trend", overlay=true)

ema8 = ta.ema(close, 8)
ema21 = ta.ema(close, 21)
ema55 = ta.ema(close, 55)

bull_stack = ema8 > ema21 and ema21 > ema55
bear_stack = ema8 < ema21 and ema21 < ema55

if bull_stack and not bull_stack[1]
    strategy.entry("Long", strategy.long)

if not bull_stack and bull_stack[1]
    strategy.close("Long")`,
  },
  {
    slug: 'atr-trend-follow',
    name: 'ATR Trend Follow',
    family: 'trend-following',
    shortDesc:
      'Volatility-adjusted trend following — trail stops by ATR multiples.',
    longDesc:
      'A simple EMA trend with ATR-based exits. Stop and trailing stop scale with the asset\'s realised volatility, so the same code works on quiet EUR/USD and wild Bitcoin. ATR multipliers (typically 2-3×) are the only parameter you need to tune per market.',
    indicators: ['EMA 21', 'ATR 14'],
    timeframes: ['1h', '4h', '1d'],
    bestFor: ['Cross-asset deployment', 'Volatile markets'],
    avoidFor: ['Low-ATR ranges'],
    appliesTo: ['commodity', 'crypto', 'index', 'forex'],
    pineCode: `//@version=5
strategy("ATR Trend Follow", overlay=true)

ema_len = input.int(21, "EMA Length")
atr_len = input.int(14, "ATR Length")
atr_mult = input.float(2.5, "ATR Multiplier")

ema = ta.ema(close, ema_len)
atr = ta.atr(atr_len)

long_stop = close - atr * atr_mult

if close > ema and close[1] <= ema[1]
    strategy.entry("Long", strategy.long)

if strategy.position_size > 0
    strategy.exit("Trail", from_entry="Long", stop=long_stop)`,
  },
];

export default strategies;

export function getStrategyBySlug(slug) {
  return strategies.find((s) => s.slug === slug);
}

export function getStrategiesByFamily(family) {
  return strategies.filter((s) => s.family === family);
}
