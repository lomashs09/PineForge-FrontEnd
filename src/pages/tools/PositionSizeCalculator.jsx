import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calculator } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Seo from '../../components/Seo';
import { buildBreadcrumbLd, SITE_URL } from '../../components/seoLd';

const SYMBOL_PRESETS = [
  { value: 'EURUSD', label: 'EUR/USD', pipSize: 0.0001, pipValue: 10 },
  { value: 'GBPUSD', label: 'GBP/USD', pipSize: 0.0001, pipValue: 10 },
  { value: 'USDJPY', label: 'USD/JPY', pipSize: 0.01, pipValue: 9.4 },
  { value: 'XAUUSD', label: 'XAUUSD (Gold)', pipSize: 0.1, pipValue: 1 },
  { value: 'BTCUSD', label: 'BTCUSD (Bitcoin)', pipSize: 1, pipValue: 1 },
  { value: 'US500', label: 'US500 (S&P)', pipSize: 0.1, pipValue: 1 },
];

export default function PositionSizeCalculator() {
  const [account, setAccount] = useState(10000);
  const [riskPct, setRiskPct] = useState(1);
  const [stopPips, setStopPips] = useState(50);
  const [symbol, setSymbol] = useState('EURUSD');

  const preset = SYMBOL_PRESETS.find((s) => s.value === symbol);

  const result = useMemo(() => {
    const riskUsd = (Number(account) || 0) * (Number(riskPct) || 0) / 100;
    const pips = Number(stopPips) || 0;
    const valuePerLotPerPip = preset?.pipValue || 10;
    if (pips <= 0 || valuePerLotPerPip <= 0) return { riskUsd, lots: 0, microLots: 0 };
    const lots = riskUsd / (pips * valuePerLotPerPip);
    return {
      riskUsd,
      lots: Math.round(lots * 1000) / 1000,
      microLots: Math.round(lots * 100) / 100,
    };
  }, [account, riskPct, stopPips, preset]);

  const path = '/tools/position-size-calculator';
  const description = 'Free position size calculator for forex, gold, crypto, and indices. Enter account size, risk percentage, and stop-loss distance — get exact lot size in seconds.';

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Position Size Calculator — Forex, Gold, Crypto, Indices"
        description={description}
        path={path}
        keywords="position size calculator, lot size calculator, forex position calculator, XAUUSD position size, BTCUSD lot size, risk calculator"
        structuredData={[
          buildBreadcrumbLd([
            { name: 'Home', url: '/' },
            { name: 'Tools', url: '/tools' },
            { name: 'Position Size Calculator', url: path },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'PineForge Position Size Calculator',
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
          Position Size Calculator
        </h1>
        <p className="mt-4 text-lg text-gray-300 leading-relaxed">
          Stop guessing your lot size. Enter your account balance, the percentage you want to risk on this trade, and your stop-loss distance — get the exact lot size that satisfies your risk rule.
        </p>

        {/* Calculator */}
        <div className="mt-10 rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Account balance (USD)">
              <input
                type="number"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white outline-none focus:border-emerald-600"
              />
            </Field>
            <Field label="Risk per trade (%)">
              <input
                type="number"
                step="0.1"
                value={riskPct}
                onChange={(e) => setRiskPct(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white outline-none focus:border-emerald-600"
              />
            </Field>
            <Field label="Stop-loss (pips)">
              <input
                type="number"
                value={stopPips}
                onChange={(e) => setStopPips(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white outline-none focus:border-emerald-600"
              />
            </Field>
            <Field label="Symbol">
              <select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white outline-none focus:border-emerald-600"
              >
                {SYMBOL_PRESETS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Results */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Result label="Risk amount" value={`$${result.riskUsd.toFixed(2)}`} />
            <Result label="Standard lots" value={result.lots.toFixed(3)} accent />
            <Result label="Micro lots (0.01)" value={result.microLots.toFixed(2)} />
          </div>
        </div>

        {/* Explainer */}
        <h2 className="mt-12 text-2xl font-bold text-white">How position size works</h2>
        <p className="mt-4 text-gray-300 leading-relaxed">
          The math is simple. The amount you're willing to lose on a trade equals the size of the trade times the distance to your stop.
        </p>
        <div className="mt-4 overflow-hidden rounded-lg border border-gray-800">
          <pre className="overflow-x-auto bg-gray-900 p-4 text-sm leading-relaxed">
            <code className="font-mono text-emerald-300">{`risk_amount = account_balance × risk_pct
lot_size    = risk_amount / (stop_loss_pips × pip_value_per_lot)`}</code>
          </pre>
        </div>

        <h2 className="mt-12 text-2xl font-bold text-white">Why 1% risk per trade matters</h2>
        <p className="mt-4 text-gray-300 leading-relaxed">
          A 1% per-trade risk lets you survive 14 consecutive losses (yes, this happens) and still have 87% of your account. At 2% risk, the same losing streak puts you down 25% — psychologically much harder to recover from. See <Link to="/glossary/drawdown" className="text-emerald-400 underline decoration-emerald-400/30 hover:decoration-emerald-400">drawdown</Link> for why this asymmetry matters.
        </p>

        <h2 className="mt-12 text-2xl font-bold text-white">Pip values used</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-gray-400">Symbol</th>
                <th className="px-4 py-2 text-left text-gray-400">Pip size</th>
                <th className="px-4 py-2 text-left text-gray-400">Pip value (1 lot)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {SYMBOL_PRESETS.map((s) => (
                <tr key={s.value} className="bg-gray-900/50">
                  <td className="px-4 py-2 font-medium text-gray-200">{s.label}</td>
                  <td className="px-4 py-2 text-gray-300">{s.pipSize}</td>
                  <td className="px-4 py-2 text-gray-300">${s.pipValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Pip values are approximate and assume USD-quoted pairs. JPY pairs and exotic crosses can vary ±10% depending on cross-rate.
        </p>

        <div className="mt-12 rounded-2xl border border-emerald-800/30 bg-gradient-to-br from-emerald-950/30 to-gray-900 p-8 text-center">
          <h3 className="text-2xl font-bold text-white">Automate the math — and the trade</h3>
          <p className="mt-2 text-gray-400">PineForge sizes positions automatically inside your Pine Script strategy. Set the risk rule once, deploy, and forget the calculator.</p>
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

function Result({ label, value, accent }) {
  return (
    <div className={`rounded-lg border p-4 ${accent ? 'border-emerald-800/50 bg-emerald-950/20' : 'border-gray-800 bg-gray-950'}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ? 'text-emerald-300' : 'text-white'}`}>{value}</p>
    </div>
  );
}
