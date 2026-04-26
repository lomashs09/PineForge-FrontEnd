// Free tools metadata — used by /tools index and per-tool SEO.
const tools = [
  {
    slug: 'position-size-calculator',
    name: 'Position Size Calculator',
    shortDesc: 'Calculate exact lot size from account balance, risk percentage, stop-loss distance, and per-pip value. Works for forex, gold, crypto, and indices.',
    keywords: 'position size calculator, lot size calculator, forex position calculator, risk calculator',
  },
  {
    slug: 'risk-reward-calculator',
    name: 'Risk-Reward Calculator',
    shortDesc: 'Compute the risk:reward ratio of any trade and the win rate you need to break even at that ratio.',
    keywords: 'risk reward calculator, R:R calculator, trade ratio, win rate calculator, expectancy calculator',
  },
  {
    slug: 'drawdown-recovery-calculator',
    name: 'Drawdown Recovery Calculator',
    shortDesc: 'How much gain do you need to recover from a drawdown? The math is asymmetric — find out exactly.',
    keywords: 'drawdown calculator, recovery calculator, trading drawdown, account recovery',
  },
];

export default tools;

export function getToolBySlug(slug) {
  return tools.find((t) => t.slug === slug);
}
