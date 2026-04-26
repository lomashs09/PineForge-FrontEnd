// Competitor comparison pages — high-intent SEO. Each entry is rendered
// as an honest, factual comparison page at /compare/<slug>.

const comparisons = [
  {
    slug: 'pineforge-vs-tradingview',
    competitor: 'TradingView',
    competitorUrl: 'https://www.tradingview.com',
    title: 'PineForge vs TradingView for Live Trading',
    shortIntro: "TradingView is where most retail traders write Pine Script — but Pine on TradingView only paper-trades. PineForge takes the same Pine Script and runs it as a live MT5 bot.",
    longIntro: "TradingView is the world's most-used charting platform, with the largest Pine Script community and the deepest charting tools. But Pine Script on TradingView is restricted to alerts and paper-trading — you can't natively connect a live broker. PineForge fills that gap: write or import the same Pine Script you already use on TradingView, then run it as a fully autonomous bot on your MT5 account.",
    pfStrengths: [
      'Live broker execution on MT5 (Exness, Pepperstone, IC Markets) — TradingView only sends alerts',
      'Pay-as-you-go pricing — $0.022/hr per active bot, no subscription',
      'Full Pine Script v5 backtesting against real OHLC + spread modeling',
      'Bot lifecycle management — start, stop, monitor, log, alerting',
      'No webhook plumbing required — strategies deploy with one click',
    ],
    competitorStrengths: [
      'Vastly larger Pine Script community and public scripts library',
      'Best-in-class charting and drawing tools',
      'Native indicator-only scripts (PineForge focuses on strategy scripts)',
      'Social features, forum, ideas — the de-facto trader social network',
    ],
    matrix: [
      { feature: 'Pine Script v5 support', pf: 'Yes (strategy scripts)', other: 'Yes (most-comprehensive)' },
      { feature: 'Live MT5 execution', pf: 'Yes', other: 'No (alerts/webhooks only)' },
      { feature: 'Backtesting on real data', pf: 'Yes — real OHLC + spread', other: 'Yes — bar-replay simulator' },
      { feature: 'Charting / drawing tools', pf: 'Minimal (strategy-focused)', other: 'Industry-leading' },
      { feature: 'Social / community', pf: 'No', other: 'Largest in retail' },
      { feature: 'Pricing', pf: '$0.022/hr per running bot', other: '$15.95–$59.95 / month subscription' },
      { feature: 'Webhook setup required for live trading', pf: 'No', other: 'Yes (3rd-party automation needed)' },
    ],
    verdict: 'Use **TradingView** for charting, idea exploration, and Pine Script community. Use **PineForge** when you want to take a strategy live without webhook plumbing or a paid TradingView Premium plan.',
  },
  {
    slug: 'pineforge-vs-3commas',
    competitor: '3Commas',
    competitorUrl: 'https://3commas.io',
    title: 'PineForge vs 3Commas for Automated Trading',
    shortIntro: "3Commas is built around pre-packaged DCA bots and grid bots for crypto. PineForge is built around custom Pine Script strategies on MT5 markets — a different audience entirely.",
    longIntro: "3Commas pioneered retail crypto bots — DCA, grid, and signal-following are their bread and butter. The audience is crypto-first traders who want pre-built strategies that 'just work'. PineForge is the opposite end of the spectrum: traders who write their own Pine Script, want to backtest the logic, and care about gold/forex/indices as much as crypto.",
    pfStrengths: [
      'Custom Pine Script strategies — full control of entry/exit logic',
      'MT5 forex, gold, indices, and crypto (not just crypto)',
      'Real backtest engine with real OHLC data',
      'Pay-as-you-go pricing — pay only when bots are running',
      'Open Pine Script ecosystem (no proprietary signal vendor lock-in)',
    ],
    competitorStrengths: [
      'Pre-packaged DCA, grid, and signal bots — no coding required',
      'Massive marketplace of subscribable signals',
      'Connects to 18+ crypto exchanges',
      'SmartTrade interface for manual + bot hybrid trading',
    ],
    matrix: [
      { feature: 'Custom strategy logic (Pine Script)', pf: 'Yes', other: 'No (preset templates only)' },
      { feature: 'Markets', pf: 'Forex, gold, crypto, indices via MT5', other: 'Crypto exchanges' },
      { feature: 'Backtesting', pf: 'Real OHLC + spread modeling', other: 'Limited (bot-specific)' },
      { feature: 'Strategy marketplace', pf: 'Library of templates', other: 'Paid signal marketplace' },
      { feature: 'Pricing', pf: '$0.022/hr per running bot', other: '$22–$79 / month subscription' },
      { feature: 'Coding required', pf: 'Yes (Pine Script)', other: 'No' },
    ],
    verdict: 'Use **3Commas** if you want pre-built crypto DCA/grid bots and don\'t want to code. Use **PineForge** if you write your own strategies and trade beyond crypto.',
  },
  {
    slug: 'pineforge-vs-metaeditor',
    competitor: 'MetaEditor (MQL5)',
    competitorUrl: 'https://www.mql5.com',
    title: 'PineForge vs MetaEditor / MQL5 for Algorithmic Trading',
    shortIntro: 'MetaEditor is MetaQuotes\' native IDE for writing MT5 Expert Advisors in MQL5. PineForge runs Pine Script on the same MT5 broker accounts — no MQL5 required.',
    longIntro: 'MetaEditor is the standard tool for MT5 algorithmic trading. You write Expert Advisors (EAs) in MQL5 — a C-like language with full access to MT5\'s API, custom indicators, and tester. The downside: MQL5 has a steep learning curve compared to Pine Script. PineForge bridges the gap by letting you write strategies in Pine Script (the friendliest scripting language in trading) and deploying them to the same MT5 brokers MQL5 EAs target.',
    pfStrengths: [
      'Pine Script v5 — far simpler than MQL5',
      'Cloud-hosted bots — no MetaTrader terminal must stay open on your PC',
      'Visual backtest engine with equity curves and trade logs',
      'No VPS rental needed — bots run on PineForge infrastructure',
      'Pay-as-you-go pricing instead of $15–$30/month VPS + free MetaEditor',
    ],
    competitorStrengths: [
      'Native, deepest MT5 integration — can call any MT5 API',
      'Free (MetaEditor + MT5 are both free)',
      'Largest community of MT5 algorithmic traders and free EAs',
      'On-the-fly debugging with the strategy tester',
      'Custom indicators with visual plotting on charts',
    ],
    matrix: [
      { feature: 'Language', pf: 'Pine Script v5', other: 'MQL5 (C-like)' },
      { feature: 'Hosting', pf: 'Cloud (managed)', other: 'Local PC or rented VPS' },
      { feature: 'Backtest engine', pf: 'Web UI + equity curve', other: 'Strategy Tester desktop app' },
      { feature: 'Custom indicators on chart', pf: 'No (strategy-focused)', other: 'Yes (deep integration)' },
      { feature: 'Coding difficulty', pf: 'Low — Pine Script is beginner-friendly', other: 'Medium-high — C-like syntax' },
      { feature: 'Pricing', pf: '$0.022/hr per running bot', other: 'Free + ~$15/mo VPS' },
      { feature: 'Need for VPS', pf: 'No', other: 'Yes for 24/5 trading' },
    ],
    verdict: 'Use **MetaEditor / MQL5** if you want the deepest MT5 integration and don\'t mind the language complexity. Use **PineForge** if you prefer Pine Script\'s simpler syntax and want managed hosting instead of running a VPS.',
  },
  {
    slug: 'pineforge-vs-quantower',
    competitor: 'Quantower',
    competitorUrl: 'https://www.quantower.com',
    title: 'PineForge vs Quantower for Multi-Asset Bots',
    shortIntro: "Quantower is a desktop multi-asset trading platform with a C# strategy SDK. PineForge is a web-based Pine Script bot platform. Different developer ergonomics, different pricing models.",
    longIntro: "Quantower targets professional traders who want a single desktop for futures, crypto, forex, and stocks across many brokers. Strategies are written in C# against the Quantower SDK and run inside the desktop terminal. PineForge is web-first, focused on MT5 brokers, and uses Pine Script — a different audience and different developer experience.",
    pfStrengths: [
      'Web-based — no desktop install or local-PC dependency',
      'Pine Script v5 instead of C# — much faster to learn',
      'Pay-as-you-go pricing — no monthly subscription',
      'Cloud-hosted bots — strategies keep running when your PC is off',
    ],
    competitorStrengths: [
      'C# SDK with full IDE integration — most-flexible strategy development',
      'Multi-broker support (futures, options, stocks beyond MT5)',
      'Advanced order types and DOM trading',
      'Custom indicators and panels in the desktop UI',
    ],
    matrix: [
      { feature: 'Language', pf: 'Pine Script v5', other: 'C# (.NET)' },
      { feature: 'Deployment', pf: 'Web — managed cloud', other: 'Desktop terminal' },
      { feature: 'Brokers', pf: 'MT5 (Exness etc.)', other: '20+ brokers — futures, stocks, crypto' },
      { feature: 'Asset classes', pf: 'Forex, gold, crypto, indices', other: 'Futures, stocks, options, crypto, forex' },
      { feature: 'Pricing', pf: '$0.022/hr per running bot', other: 'Free tier + $59–$99/mo Pro' },
      { feature: 'Coding difficulty', pf: 'Low', other: 'High (C# strategy SDK)' },
    ],
    verdict: 'Use **Quantower** for multi-asset C# strategy development with a professional desktop terminal. Use **PineForge** for simpler Pine Script bots on MT5, hosted in the cloud, with no monthly subscription.',
  },
];

export default comparisons;

export function getComparisonBySlug(slug) {
  return comparisons.find((c) => c.slug === slug);
}
