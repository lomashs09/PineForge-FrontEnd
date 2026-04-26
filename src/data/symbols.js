// Mirror of backend api/symbols.py — keep in sync when backend list changes.
// Added marketing/SEO metadata (volatility, sessions, summary) used by the
// programmatic /strategies/<symbol>-<strategy> pages.

const symbols = [
  {
    slug: 'xauusd',
    display: 'XAUUSD',
    name: 'Gold',
    category: 'commodity',
    volatility: 'high',
    sessions: 'London, New York (24/5)',
    summary:
      'Gold (XAUUSD) is the most-traded commodity pair in retail forex. Strong directional moves during news, high intraday volatility, and clean trending behavior on H1/H4 — a favourite for trend-following and breakout bots.',
  },
  {
    slug: 'xagusd',
    display: 'XAGUSD',
    name: 'Silver',
    category: 'commodity',
    volatility: 'very-high',
    sessions: 'London, New York (24/5)',
    summary:
      'Silver (XAGUSD) is more volatile than gold with sharper retracements. Mean-reversion and breakout strategies tend to outperform trend-following on lower timeframes.',
  },
  {
    slug: 'eurusd',
    display: 'EURUSD',
    name: 'EUR/USD',
    category: 'forex',
    volatility: 'medium',
    sessions: 'London, New York (24/5)',
    summary:
      'EUR/USD is the most liquid forex pair on the planet. Tight spreads, predictable session-based behavior, and clean technicals make it a default training ground for forex bots.',
  },
  {
    slug: 'gbpusd',
    display: 'GBPUSD',
    name: 'GBP/USD',
    category: 'forex',
    volatility: 'high',
    sessions: 'London, New York (24/5)',
    summary:
      'GBP/USD ("Cable") is wider-ranging than EUR/USD with sharper breakouts during the London open. Trend and breakout strategies work well; pure mean-reversion struggles in news weeks.',
  },
  {
    slug: 'usdjpy',
    display: 'USDJPY',
    name: 'USD/JPY',
    category: 'forex',
    volatility: 'medium',
    sessions: 'Tokyo, London, New York (24/5)',
    summary:
      'USD/JPY is heavily driven by yield differentials and BoJ policy. Slow-grinding trends on the daily, predictable Tokyo-session ranges — a strong fit for swing and trend bots.',
  },
  {
    slug: 'usdchf',
    display: 'USDCHF',
    name: 'USD/CHF',
    category: 'forex',
    volatility: 'medium',
    sessions: 'London, New York (24/5)',
    summary:
      'USD/CHF often inverts EUR/USD. Range-bound for long stretches, then violent SNB-driven breakouts. Bots should layer in volatility filters.',
  },
  {
    slug: 'audusd',
    display: 'AUDUSD',
    name: 'AUD/USD',
    category: 'forex',
    volatility: 'medium',
    sessions: 'Sydney, London, New York (24/5)',
    summary:
      'AUD/USD is a risk-on / commodity-correlated pair. Mean-reversion in quiet sessions, breakout in NY — bots that adapt by session see best results.',
  },
  {
    slug: 'nzdusd',
    display: 'NZDUSD',
    name: 'NZD/USD',
    category: 'forex',
    volatility: 'medium',
    sessions: 'Sydney, London, New York (24/5)',
    summary:
      'NZD/USD ("Kiwi") behaves like a smaller-volume Aussie. Less liquid in Tokyo session, cleaner trends in NY.',
  },
  {
    slug: 'btcusd',
    display: 'BTCUSD',
    name: 'Bitcoin',
    category: 'crypto',
    volatility: 'very-high',
    sessions: '24/7',
    summary:
      'Bitcoin trades 24/7 with extreme directional moves. Strong on trend and momentum, brutal on naive mean-reversion. Use ATR-aware stops and avoid weekend liquidity gaps.',
  },
  {
    slug: 'ethusd',
    display: 'ETHUSD',
    name: 'Ethereum',
    category: 'crypto',
    volatility: 'very-high',
    sessions: '24/7',
    summary:
      'Ethereum tends to amplify Bitcoin moves both up and down. Same playbook as BTC — trend, momentum, breakout — with even wider risk bands.',
  },
  {
    slug: 'us30',
    display: 'US30',
    name: 'Dow Jones',
    category: 'index',
    volatility: 'medium',
    sessions: 'New York (Mon–Fri, with extended hours)',
    summary:
      'The Dow (US30) is composed of 30 large-cap blue chips. Trends cleanly through earnings season, gaps on overnight news. Trend and breakout strategies are the natural fit.',
  },
  {
    slug: 'us500',
    display: 'US500',
    name: 'S&P 500',
    category: 'index',
    volatility: 'medium',
    sessions: 'New York (Mon–Fri, with extended hours)',
    summary:
      'The S&P 500 (US500) is the global benchmark equity index. Strong long-term uptrend with regime shifts; momentum and trend bots dominate, mean-reversion works in QE periods only.',
  },
  {
    slug: 'ustec',
    display: 'USTEC',
    name: 'Nasdaq 100',
    category: 'index',
    volatility: 'high',
    sessions: 'New York (Mon–Fri, with extended hours)',
    summary:
      'Nasdaq 100 (USTEC) is the high-beta cousin of the S&P. Sharper moves, longer trends, deeper drawdowns. Strong momentum and breakout candidate.',
  },
];

export default symbols;

export function getSymbolBySlug(slug) {
  return symbols.find((s) => s.slug === slug.toLowerCase());
}

export function getSymbolsByCategory(category) {
  return symbols.filter((s) => s.category === category);
}
