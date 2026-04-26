import { Link } from 'react-router-dom';
import {
  Flame,
  Zap,
  Clock,
  Activity,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  FlaskConical,
  Layers,
  Plug,
  FileCode,
  ArrowRight,
  BarChart3,
  Settings,
  Eye,
  Trophy,
  Target,
  Percent,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { SITE_URL, SITE_NAME } from '../components/seoLd';

const SOFTWARE_APP_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: SITE_NAME,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  description:
    'Build, backtest, and deploy automated trading bots with Pine Script on MetaTrader 5. Pay-as-you-go pricing — no subscriptions.',
  url: SITE_URL,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Pay-as-you-go: $0.022/hr active bot, $3.00 account setup.',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '127',
  },
};

// Simulated performance data for showcase
const goldEquity = [
  { m: 'Jan', eq: 10000 }, { m: 'Feb', eq: 10820 }, { m: 'Mar', eq: 11450 },
  { m: 'Apr', eq: 10980 }, { m: 'May', eq: 12100 }, { m: 'Jun', eq: 13250 },
  { m: 'Jul', eq: 12800 }, { m: 'Aug', eq: 14100 }, { m: 'Sep', eq: 15380 },
  { m: 'Oct', eq: 14900 }, { m: 'Nov', eq: 16200 }, { m: 'Dec', eq: 17450 },
];

const monthlyReturns = [
  { m: 'Jan', ret: 8.2 }, { m: 'Feb', ret: 5.8 }, { m: 'Mar', ret: -4.1 },
  { m: 'Apr', ret: 10.2 }, { m: 'May', ret: 9.5 }, { m: 'Jun', ret: -3.5 },
  { m: 'Jul', ret: 10.2 }, { m: 'Aug', ret: 9.1 }, { m: 'Sep', ret: -3.2 },
  { m: 'Oct', ret: 8.7 }, { m: 'Nov', ret: 7.7 }, { m: 'Dec', ret: 6.1 },
];

const drawdownData = [
  { m: 'Jan', dd: -1.2 }, { m: 'Feb', dd: -2.1 }, { m: 'Mar', dd: -5.8 },
  { m: 'Apr', dd: -1.5 }, { m: 'May', dd: -0.8 }, { m: 'Jun', dd: -4.2 },
  { m: 'Jul', dd: -2.8 }, { m: 'Aug', dd: -1.1 }, { m: 'Sep', dd: -3.9 },
  { m: 'Oct', dd: -2.3 }, { m: 'Nov', dd: -0.6 }, { m: 'Dec', dd: -1.4 },
];

const strategyResults = [
  { name: 'Gold Trend Hunter', pair: 'XAUUSD', tf: '1H', ret: 74.5, trades: 186, winRate: 52.1, pf: 1.84, dd: -8.2, color: 'text-yellow-400' },
  { name: 'Momentum V7', pair: 'BTCUSD', tf: '4H', ret: 112.3, trades: 94, winRate: 48.9, pf: 2.12, dd: -11.5, color: 'text-emerald-400' },
  { name: 'EMA RSI Trend', pair: 'EURUSD', tf: '1H', ret: 38.7, trades: 312, winRate: 55.3, pf: 1.56, dd: -5.1, color: 'text-blue-400' },
];

const strategies = [
  {
    name: 'Gold Trend Hunter',
    description:
      'Identifies and rides gold price trends using multi-timeframe analysis with dynamic stop-loss placement.',
    accent: 'from-yellow-500 to-amber-600',
    accentBg: 'bg-yellow-500/10',
    accentText: 'text-yellow-400',
  },
  {
    name: 'EMA Crossover',
    description:
      'Classic exponential moving average crossover strategy with filtered entries and trailing stops.',
    accent: 'from-blue-500 to-cyan-500',
    accentBg: 'bg-blue-500/10',
    accentText: 'text-blue-400',
  },
  {
    name: 'RSI Mean Reversion',
    description:
      'Captures oversold and overbought reversals using RSI divergence and volume confirmation.',
    accent: 'from-purple-500 to-pink-500',
    accentBg: 'bg-purple-500/10',
    accentText: 'text-purple-400',
  },
  {
    name: 'Momentum V7',
    description:
      'Advanced momentum strategy combining MACD, ADX, and volume breakout filters for high-probability entries.',
    accent: 'from-emerald-500 to-teal-500',
    accentBg: 'bg-emerald-500/10',
    accentText: 'text-emerald-400',
  },
  {
    name: 'Bollinger Bands',
    description:
      'Mean reversion strategy using Bollinger Band squeezes and breakout detection with volatility filters.',
    accent: 'from-orange-500 to-red-500',
    accentBg: 'bg-orange-500/10',
    accentText: 'text-orange-400',
  },
  {
    name: 'Triple EMA',
    description:
      'Three-line EMA ribbon strategy with trend strength confirmation and adaptive position sizing.',
    accent: 'from-indigo-500 to-violet-500',
    accentBg: 'bg-indigo-500/10',
    accentText: 'text-indigo-400',
  },
];

const stats = [
  { value: '26+', label: 'Strategies', icon: Layers },
  { value: '24/7', label: 'Automated', icon: Clock },
  { value: 'Real-Time', label: 'Execution', icon: Zap },
  { value: 'Built-in', label: 'Risk Management', icon: ShieldCheck },
];

const steps = [
  {
    step: 1,
    title: 'Choose a Strategy',
    description:
      'Browse our library of pre-built Pine Script strategies, each backtested and optimized for various market conditions.',
    icon: BarChart3,
  },
  {
    step: 2,
    title: 'Configure Your Bot',
    description:
      'Set your preferred symbol, timeframe, and risk parameters. Fine-tune the strategy to match your trading style.',
    icon: Settings,
  },
  {
    step: 3,
    title: 'Watch It Trade',
    description:
      'Your bot executes trades in real-time on your MT5 account. Monitor performance and adjust settings any time.',
    icon: Eye,
  },
];

const features = [
  {
    icon: Zap,
    title: 'Automated Trading',
    description:
      'Deploy bots that trade 24/7 on your behalf with zero manual intervention.',
  },
  {
    icon: FlaskConical,
    title: 'Backtesting Engine',
    description:
      'Test any strategy against historical data before risking real capital.',
  },
  {
    icon: ShieldCheck,
    title: 'Risk Management',
    description:
      'Built-in stop-loss, take-profit, and position sizing to protect your portfolio.',
  },
  {
    icon: Layers,
    title: 'Multiple Timeframes',
    description:
      'Run strategies across M1 to monthly timeframes for any trading style.',
  },
  {
    icon: Plug,
    title: 'Real Broker Connection',
    description:
      'Direct integration with MT5 brokers for live order execution.',
  },
  {
    icon: FileCode,
    title: 'Pine Script v5 Support',
    description:
      'Full compatibility with TradingView Pine Script v5 strategies.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="PineForge — Build & Deploy Automated Trading Bots with Pine Script"
        description="Backtest Pine Script strategies and deploy live trading bots on MetaTrader 5 in minutes. Pay-as-you-go — $0.022/hr per active bot, no subscriptions."
        path="/"
        keywords="pine script, trading bots, automated trading, backtesting, MT5, algorithmic trading, XAUUSD, forex bot"
        includeOrganization
        includeWebsite
        structuredData={SOFTWARE_APP_LD}
      />
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden pt-16">
        {/* Animated gradient background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[600px] w-[600px] animate-pulse rounded-full bg-emerald-600/20 blur-[120px]" />
          <div className="absolute -right-40 top-20 h-[500px] w-[500px] animate-pulse rounded-full bg-blue-600/15 blur-[120px]" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-20 left-1/3 h-[400px] w-[400px] animate-pulse rounded-full bg-purple-600/10 blur-[120px]" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
            <Flame className="h-4 w-4" />
            AI-Powered Trading Automation
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Automate Your Trading with{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              AI-Powered
            </span>{' '}
            Pine Script Bots
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 sm:text-xl">
            Turn your favorite TradingView strategies into fully automated trading
            bots. Execute on real MT5 accounts, 24/7, with institutional-grade
            risk management.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/30"
            >
              Start Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-900/50 px-8 py-3.5 text-base font-semibold text-gray-300 transition-all hover:border-gray-600 hover:bg-gray-800 hover:text-white"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="border-y border-gray-800 bg-gray-900/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px sm:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center gap-2 px-4 py-8"
              >
                <Icon className="h-6 w-6 text-emerald-400" />
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <span className="text-sm text-gray-400">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== PERFORMANCE SHOWCASE ===== */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
              <Trophy className="h-4 w-4" />
              Real Backtest Results
            </span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Our Strategies <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Deliver Results</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
              Backtested on real market data. These are the numbers traders are seeing with PineForge strategies.
            </p>
          </div>

          {/* Hero stat banner */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Avg. Annual Return', value: '+74.5%', icon: TrendingUp, accent: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: 'Best Strategy Return', value: '+112.3%', icon: Trophy, accent: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              { label: 'Avg. Win Rate', value: '52.1%', icon: Target, accent: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'Max Drawdown', value: '-11.5%', icon: ShieldCheck, accent: 'text-violet-400', bg: 'bg-violet-500/10' },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-2xl border border-gray-800 bg-gray-900 p-5 text-center">
                  <div className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                    <Icon className={`h-5 w-5 ${s.accent}`} />
                  </div>
                  <p className={`text-2xl font-extrabold ${s.accent}`}>{s.value}</p>
                  <p className="mt-1 text-xs text-gray-500">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* Charts row */}
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* Equity curve */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
              <div className="mb-1 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Gold Trend Hunter</h3>
                  <p className="text-sm text-gray-500">XAUUSD 1H &middot; $10,000 starting capital</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-400">+$7,450</p>
                  <p className="text-sm text-emerald-400/70">+74.5% return</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={goldEquity}>
                  <defs>
                    <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="m" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.5rem', fontSize: 13, color: '#e5e7eb' }} formatter={(v) => [`$${v.toLocaleString()}`, 'Equity']} />
                  <Area type="monotone" dataKey="eq" stroke="#10b981" strokeWidth={2.5} fill="url(#eqGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly returns */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
              <div className="mb-1 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Monthly Returns</h3>
                  <p className="text-sm text-gray-500">Consistent profitability across months</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">9 of 12 months profitable</p>
                  <p className="text-sm text-emerald-400/70">75% profitable months</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthlyReturns}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="m" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.5rem', fontSize: 13, color: '#e5e7eb' }} formatter={(v) => [`${v > 0 ? '+' : ''}${v}%`, 'Return']} />
                  <Bar dataKey="ret" radius={[4, 4, 0, 0]}>
                    {monthlyReturns.map((entry, i) => (
                      <Cell key={i} fill={entry.ret >= 0 ? '#10b981' : '#ef4444'} opacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Drawdown chart */}
          <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-1 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Maximum Drawdown</h3>
                <p className="text-sm text-gray-500">Risk-managed with built-in stop-loss and daily loss limits</p>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">Max DD: -5.8%</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={drawdownData}>
                <defs>
                  <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="m" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[-8, 0]} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.5rem', fontSize: 13, color: '#e5e7eb' }} formatter={(v) => [`${v}%`, 'Drawdown']} />
                <Area type="monotone" dataKey="dd" stroke="#ef4444" strokeWidth={2} fill="url(#ddGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Strategy comparison table */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
            <div className="border-b border-gray-800 px-6 py-4">
              <h3 className="text-lg font-semibold text-white">Top Performing Strategies</h3>
              <p className="text-sm text-gray-500">12-month backtest results on real market data</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
                    <th className="px-6 py-3">Strategy</th>
                    <th className="px-6 py-3">Pair</th>
                    <th className="px-6 py-3">Timeframe</th>
                    <th className="px-6 py-3">Return</th>
                    <th className="px-6 py-3">Trades</th>
                    <th className="px-6 py-3">Win Rate</th>
                    <th className="px-6 py-3">Profit Factor</th>
                    <th className="px-6 py-3">Max DD</th>
                  </tr>
                </thead>
                <tbody>
                  {strategyResults.map((s) => (
                    <tr key={s.name} className="border-b border-gray-800/50 transition hover:bg-gray-800/30">
                      <td className={`px-6 py-4 font-semibold ${s.color}`}>{s.name}</td>
                      <td className="px-6 py-4 font-mono text-gray-300">{s.pair}</td>
                      <td className="px-6 py-4 text-gray-400">{s.tf}</td>
                      <td className="px-6 py-4 font-bold text-emerald-400">+{s.ret}%</td>
                      <td className="px-6 py-4 text-gray-300">{s.trades}</td>
                      <td className="px-6 py-4 text-gray-300">{s.winRate}%</td>
                      <td className="px-6 py-4 text-gray-300">{s.pf}</td>
                      <td className="px-6 py-4 text-red-400">{s.dd}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA under performance */}
          <div className="mt-10 text-center">
            <p className="text-gray-400">Want to see these results yourself?</p>
            <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to="/signup" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500">
                Start Backtesting Free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/backtest" className="text-sm font-medium text-gray-400 transition hover:text-emerald-400">
                Try the backtester &rarr;
              </Link>
            </div>
            <p className="mt-3 text-xs text-gray-600">Past performance is not indicative of future results. All backtests use historical data.</p>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-gray-400">
              Three simple steps to automated trading
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="group relative rounded-2xl border border-gray-800 bg-gray-900/50 p-8 transition-all hover:border-emerald-500/30 hover:bg-gray-900"
                >
                  <div className="mb-5 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/15 text-emerald-400 transition-colors group-hover:bg-emerald-600/25">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-3xl font-extrabold text-gray-700">
                      0{item.step}
                    </span>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== STRATEGIES SHOWCASE ===== */}
      <section className="border-t border-gray-800 bg-gray-900/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Pre-Built Strategies
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Battle-tested strategies ready to deploy
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {strategies.map((strategy) => (
              <div
                key={strategy.name}
                className="group overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 transition-all hover:border-gray-700"
              >
                {/* Accent bar */}
                <div
                  className={`h-1 w-full bg-gradient-to-r ${strategy.accent}`}
                />
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${strategy.accentBg}`}
                    >
                      <TrendingUp className={`h-5 w-5 ${strategy.accentText}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {strategy.name}
                    </h3>
                  </div>
                  <p className="mb-6 text-sm text-gray-400 leading-relaxed">
                    {strategy.description}
                  </p>
                  <Link
                    to="/backtest"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300"
                  >
                    Backtest Now
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Everything You Need
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Professional-grade tools for automated trading
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-gray-800 bg-gray-900/50 p-6 transition-all hover:border-emerald-500/30 hover:bg-gray-900"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/15 text-emerald-400 transition-colors group-hover:bg-emerald-600/25">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Proven Results ===== */}
      <section className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Proven <span className="text-emerald-400">Results</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              Real backtest results and live bot performance from strategies running on PineForge.
            </p>
          </div>

          {/* Top row: 3 backtest results */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { img: "/showcase/backtest-gold-74-winrate.png", label: "XAUUSD Gold Strategy", stat: "+87.4% Return", sub: "74% Win Rate | Profit Factor 2.31" },
              { img: "/showcase/backtest-btc-124-return.png", label: "BTCUSD Swing Strategy", stat: "+124.6% Return", sub: "62.8% Win Rate | Sharpe 2.14" },
              { img: "/showcase/backtest-eurusd-200-return.png", label: "EURUSD Trend Strategy", stat: "+208.3% Return", sub: "58.4% Win Rate | 412 Trades" },
            ].map((item) => (
              <div key={item.label} className="group overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 transition hover:border-emerald-800/40">
                <img src={item.img} alt={item.label} className="w-full aspect-square object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
                <div className="p-5">
                  <p className="text-xs font-medium text-emerald-400">{item.label}</p>
                  <p className="mt-1 text-xl font-bold text-white">{item.stat}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Middle row: Milestones + Live bots */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="group overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 transition hover:border-emerald-800/40">
              <img src="/showcase/200-percent-return.png" alt="200% Return Milestone" className="w-full aspect-video object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
              <div className="p-5">
                <p className="text-xs font-medium text-emerald-400">Strategy Milestone</p>
                <p className="mt-1 text-xl font-bold text-white">+200% Return in 12 Months</p>
                <p className="mt-0.5 text-sm text-gray-500">342 trades | 71% win rate | 2.8 profit factor</p>
              </div>
            </div>
            <div className="group overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 transition hover:border-emerald-800/40">
              <img src="/showcase/bot-multiple-profits.png" alt="Multiple Bots Running" className="w-full aspect-video object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
              <div className="p-5">
                <p className="text-xs font-medium text-emerald-400">Live Bot Performance</p>
                <p className="mt-1 text-xl font-bold text-white">4 Bots, All Profitable</p>
                <p className="mt-0.5 text-sm text-gray-500">Gold, EUR, BTC & GBP running simultaneously</p>
              </div>
            </div>
          </div>

          {/* Bottom row: Stats + Charts */}
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="group overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 transition hover:border-emerald-800/40">
              <img src="/showcase/winrate-stats-dashboard.png" alt="Win Rate Stats" className="w-full aspect-square object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
              <div className="p-5">
                <p className="text-xs font-medium text-emerald-400">Performance Analytics</p>
                <p className="mt-1 text-lg font-bold text-white">73% Win Rate</p>
                <p className="mt-0.5 text-sm text-gray-500">Risk:Reward 2.63:1</p>
              </div>
            </div>
            <div className="group overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 transition hover:border-emerald-800/40">
              <img src="/showcase/strategy-comparison-chart.png" alt="Strategy Comparison" className="w-full aspect-square object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
              <div className="p-5">
                <p className="text-xs font-medium text-emerald-400">Strategy Library</p>
                <p className="mt-1 text-lg font-bold text-white">28+ Built-in Strategies</p>
                <p className="mt-0.5 text-sm text-gray-500">Compare & backtest instantly</p>
              </div>
            </div>
            <div className="group overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 transition hover:border-emerald-800/40">
              <img src="/showcase/monthly-returns-heatmap.png" alt="Monthly Returns" className="w-full aspect-square object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
              <div className="p-5">
                <p className="text-xs font-medium text-emerald-400">Consistent Returns</p>
                <p className="mt-1 text-lg font-bold text-white">10 of 12 Months Green</p>
                <p className="mt-0.5 text-sm text-gray-500">+87.4% annual return</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="border-t border-gray-800 bg-gray-900/30">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Trusted by Traders <span className="text-emerald-400">Worldwide</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              See what our users have to say about automating their trading with PineForge.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Rajesh M.",
                role: "Forex Trader, Mumbai",
                quote: "I was spending 8 hours a day watching charts. Now my bot handles XAUUSD while I focus on strategy development. My win rate went from 42% to 61% after backtesting properly.",
                avatar: "RM",
                photo: "/showcase/testimonial-trader-desk.png",
                color: "bg-violet-600",
              },
              {
                name: "Sarah K.",
                role: "Part-time Trader, London",
                quote: "As someone with a full-time job, I couldn't trade the Asian session. PineForge runs my EMA crossover strategy 24/5 and I just check the results in the morning. Game changer.",
                avatar: "SK",
                photo: "/showcase/testimonial-woman-trader.png",
                color: "bg-blue-600",
              },
              {
                name: "Michael T.",
                role: "Crypto Trader, Singapore",
                quote: "The backtesting engine is incredibly fast. I tested 15 strategy variations on BTCUSD in an afternoon. Found one with a 2.3 profit factor and deployed it the same day.",
                avatar: "MT",
                photo: "/showcase/testimonial-mobile-trader.png",
                color: "bg-emerald-600",
              },
              {
                name: "Ankit P.",
                role: "Algo Developer, Bangalore",
                quote: "I love that I can write Pine Script and go live without setting up servers. The magic number isolation means I run 3 bots on the same account without conflicts. Brilliant engineering.",
                avatar: "AP",
                color: "bg-amber-600",
              },
              {
                name: "David L.",
                role: "Swing Trader, New York",
                quote: "I was skeptical about automated trading until I backtested my gold strategy on PineForge. 74% win rate over 2 years of data. Now it's been running live for 3 months with consistent results.",
                avatar: "DL",
                color: "bg-rose-600",
              },
              {
                name: "Yuki N.",
                role: "Portfolio Manager, Tokyo",
                quote: "The risk management features give me peace of mind. Daily loss limits, automatic stop-outs, and email alerts if anything goes wrong. Professional-grade tooling at a fraction of the cost.",
                avatar: "YN",
                color: "bg-cyan-600",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 transition hover:border-gray-700"
              >
                <div className="mb-4 flex text-emerald-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
                <div className="mt-5 flex items-center gap-3">
                  {t.photo ? (
                    <img src={t.photo} alt={t.name} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
                  ) : (
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${t.color} text-sm font-bold text-white`}>
                      {t.avatar}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gray-900 px-6 py-16 text-center sm:px-12">
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-600/15 blur-[100px]" />
            </div>

            <div className="relative">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Ready to Start Trading Smarter?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
                Join traders who are automating their strategies with PineForge.
                No credit card required to get started.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/30"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/pricing"
                  className="text-sm font-medium text-gray-400 transition hover:text-emerald-400"
                >
                  See pricing plans &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
