import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calculator } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Seo from '../../components/Seo';
import { buildBreadcrumbLd, SITE_URL } from '../../components/seoLd';

export default function DrawdownRecoveryCalculator() {
  const [drawdown, setDrawdown] = useState(20);
  const [monthlyReturn, setMonthlyReturn] = useState(2);

  const result = useMemo(() => {
    const dd = Number(drawdown) || 0;
    const mr = Number(monthlyReturn) || 0;
    if (dd <= 0 || dd >= 100) return { recoveryPct: 0, monthsToRecover: 0 };
    const remaining = 1 - dd / 100;
    const recoveryPct = (1 / remaining - 1) * 100;
    let monthsToRecover = 0;
    if (mr > 0) {
      monthsToRecover = Math.log(1 / remaining) / Math.log(1 + mr / 100);
    }
    return {
      recoveryPct: recoveryPct.toFixed(1),
      monthsToRecover: monthsToRecover > 0 ? monthsToRecover.toFixed(1) : '∞',
    };
  }, [drawdown, monthlyReturn]);

  const path = '/tools/drawdown-recovery-calculator';

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Drawdown Recovery Calculator — How Much Gain to Break Even"
        description="Calculate the percentage gain you need to recover from a drawdown — and the months it'll take at your average monthly return. Free tool."
        path={path}
        keywords="drawdown calculator, recovery calculator, drawdown recovery, account recovery, trading drawdown"
        structuredData={[
          buildBreadcrumbLd([
            { name: 'Home', url: '/' },
            { name: 'Tools', url: '/tools' },
            { name: 'Drawdown Recovery Calculator', url: path },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'PineForge Drawdown Recovery Calculator',
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
          Drawdown Recovery Calculator
        </h1>
        <p className="mt-4 text-lg text-gray-300 leading-relaxed">
          The math of recovery is asymmetric — losing 50% requires a 100% gain to get back to even, not 50%. Find out exactly how much you need.
        </p>

        <div className="mt-10 rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Current drawdown (%)">
              <input
                type="number"
                step="any"
                value={drawdown}
                onChange={(e) => setDrawdown(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white outline-none focus:border-emerald-600"
              />
            </Field>
            <Field label="Average monthly return (%)">
              <input
                type="number"
                step="any"
                value={monthlyReturn}
                onChange={(e) => setMonthlyReturn(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white outline-none focus:border-emerald-600"
              />
            </Field>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Result label="Recovery needed" value={`+${result.recoveryPct}%`} accent />
            <Result label="Months at this return" value={result.monthsToRecover === '∞' ? '∞' : `${result.monthsToRecover}`} />
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-bold text-white">The asymmetry table</h2>
        <p className="mt-4 text-gray-300 leading-relaxed">
          The bigger the drawdown, the disproportionately bigger the gain you need to recover. This is why every serious risk manager prioritises drawdown control over raw return.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-gray-400">Drawdown</th>
                <th className="px-4 py-2 text-left text-gray-400">Recovery needed</th>
                <th className="px-4 py-2 text-left text-gray-400">Months at 2%/mo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {[10, 20, 33, 50, 75, 90].map((d) => {
                const remaining = 1 - d / 100;
                const recovery = (1 / remaining - 1) * 100;
                const months = Math.log(1 / remaining) / Math.log(1.02);
                return (
                  <tr key={d} className="bg-gray-900/50">
                    <td className="px-4 py-2 font-medium text-gray-200">{d}%</td>
                    <td className="px-4 py-2 text-emerald-300">+{recovery.toFixed(1)}%</td>
                    <td className="px-4 py-2 text-gray-300">{months.toFixed(0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 text-2xl font-bold text-white">Why this kills retail accounts</h2>
        <p className="mt-4 text-gray-300 leading-relaxed">
          Most retail traders abandon their system at 30% drawdown — exactly when they shouldn't. The fix isn't iron willpower; it's <Link to="/glossary/position-sizing" className="text-emerald-400 underline decoration-emerald-400/30 hover:decoration-emerald-400">position sizing</Link> that keeps the maximum drawdown low enough to live with. Use our <Link to="/tools/position-size-calculator" className="text-emerald-400 underline decoration-emerald-400/30 hover:decoration-emerald-400">position size calculator</Link> with a 1% risk rule.
        </p>

        <div className="mt-12 rounded-2xl border border-emerald-800/30 bg-gradient-to-br from-emerald-950/30 to-gray-900 p-8 text-center">
          <h3 className="text-2xl font-bold text-white">Know your drawdown before you live-trade</h3>
          <p className="mt-2 text-gray-400">PineForge backtests show your max drawdown so you can pre-empt the recovery math.</p>
          <Link to="/signup" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition">
            Backtest Free <ArrowRight className="h-4 w-4" />
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
function Result({ label, value, accent }) {
  return (
    <div className={`rounded-lg border p-4 ${accent ? 'border-emerald-800/50 bg-emerald-950/20' : 'border-gray-800 bg-gray-950'}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ? 'text-emerald-300' : 'text-white'}`}>{value}</p>
    </div>
  );
}
