import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calculator } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Seo from '../../components/Seo';
import { buildBreadcrumbLd, SITE_URL } from '../../components/seoLd';

export default function RiskRewardCalculator() {
  const [entry, setEntry] = useState(2000);
  const [stop, setStop] = useState(1980);
  const [target, setTarget] = useState(2050);

  const r = useMemo(() => {
    const e = Number(entry) || 0;
    const s = Number(stop) || 0;
    const t = Number(target) || 0;
    const risk = Math.abs(e - s);
    const reward = Math.abs(t - e);
    if (risk <= 0) return { risk: 0, reward: 0, ratio: 0, breakEvenWinRate: 0 };
    const ratio = reward / risk;
    const breakEvenWinRate = ratio > 0 ? 100 / (1 + ratio) : 100;
    return {
      risk: risk.toFixed(2),
      reward: reward.toFixed(2),
      ratio: ratio.toFixed(2),
      breakEvenWinRate: breakEvenWinRate.toFixed(1),
    };
  }, [entry, stop, target]);

  const path = '/tools/risk-reward-calculator';
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Risk-Reward Calculator — Find Your Break-Even Win Rate"
        description="Calculate the risk:reward ratio of any trade and the win rate you need to break even. Free, instant, no signup."
        path={path}
        keywords="risk reward calculator, R:R calculator, win rate calculator, expectancy calculator, trade ratio"
        structuredData={[
          buildBreadcrumbLd([
            { name: 'Home', url: '/' },
            { name: 'Tools', url: '/tools' },
            { name: 'Risk-Reward Calculator', url: path },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'PineForge Risk-Reward Calculator',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            url: `${SITE_URL}${path}`,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          },
        ]}
      />
      <Navbar />

      <article className="mx-auto max-w-3xl px-4 pt-28 pb-16 sm:px-6">
        <Link to="/tools" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-400 transition mb-6">
          <ArrowLeft className="h-4 w-4" /> All Tools
        </Link>

        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-400">Free Calculator</span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
          Risk-Reward Calculator
        </h1>
        <p className="mt-4 text-lg text-gray-300 leading-relaxed">
          Enter your entry, stop, and target. Get the R:R ratio and the minimum win rate that makes the trade profitable over time.
        </p>

        <div className="mt-10 rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Entry"><Input v={entry} on={setEntry} /></Field>
            <Field label="Stop loss"><Input v={stop} on={setStop} /></Field>
            <Field label="Target"><Input v={target} on={setTarget} /></Field>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-4">
            <Result label="Risk" value={r.risk} />
            <Result label="Reward" value={r.reward} />
            <Result label="R:R" value={`1:${r.ratio}`} accent />
            <Result label="Break-even win rate" value={`${r.breakEvenWinRate}%`} />
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-bold text-white">What "break-even win rate" means</h2>
        <p className="mt-4 text-gray-300 leading-relaxed">
          If your average winner is 2× your average loser, you can win only 33.4% of the time and still break even. If your winner is just 1× your loser, you need 50%+. This is why high-R:R setups need lower win rates to be profitable.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-gray-400">R:R Ratio</th>
                <th className="px-4 py-2 text-left text-gray-400">Break-even win rate</th>
                <th className="px-4 py-2 text-left text-gray-400">Style</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <tr className="bg-gray-900/50"><td className="px-4 py-2 text-gray-200">1:1</td><td className="px-4 py-2 text-gray-300">50.0%</td><td className="px-4 py-2 text-gray-400">Mean reversion / scalping</td></tr>
              <tr className="bg-gray-900/50"><td className="px-4 py-2 text-gray-200">1:2</td><td className="px-4 py-2 text-gray-300">33.4%</td><td className="px-4 py-2 text-gray-400">Swing</td></tr>
              <tr className="bg-gray-900/50"><td className="px-4 py-2 text-gray-200">1:3</td><td className="px-4 py-2 text-gray-300">25.0%</td><td className="px-4 py-2 text-gray-400">Trend following</td></tr>
              <tr className="bg-gray-900/50"><td className="px-4 py-2 text-gray-200">1:5</td><td className="px-4 py-2 text-gray-300">16.7%</td><td className="px-4 py-2 text-gray-400">Breakout / momentum</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 text-2xl font-bold text-white">Why the win-rate trap matters</h2>
        <p className="mt-4 text-gray-300 leading-relaxed">
          A 90% win rate sounds good — but if average wins are $10 and losses average $200, you have a losing system. Always pair your <Link to="/glossary/win-rate" className="text-emerald-400 underline decoration-emerald-400/30 hover:decoration-emerald-400">win rate</Link> with R:R when judging a strategy. See also <Link to="/glossary/profit-factor" className="text-emerald-400 underline decoration-emerald-400/30 hover:decoration-emerald-400">profit factor</Link> for the more honest single-number version.
        </p>

        <div className="mt-12 rounded-2xl border border-emerald-800/30 bg-gradient-to-br from-emerald-950/30 to-gray-900 p-8 text-center">
          <h3 className="text-2xl font-bold text-white">Backtest your edge — don't guess it</h3>
          <p className="mt-2 text-gray-400">PineForge runs every strategy on real OHLC data and reports your actual R:R, win rate, and profit factor.</p>
          <Link to="/signup" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition">
            Try PineForge Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
function Input({ v, on }) {
  return (
    <input
      type="number"
      step="any"
      value={v}
      onChange={(e) => on(e.target.value)}
      className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white outline-none focus:border-emerald-600"
    />
  );
}
function Result({ label, value, accent }) {
  return (
    <div className={`rounded-lg border p-4 ${accent ? 'border-emerald-800/50 bg-emerald-950/20' : 'border-gray-800 bg-gray-950'}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ? 'text-emerald-300' : 'text-white'}`}>{value}</p>
    </div>
  );
}
