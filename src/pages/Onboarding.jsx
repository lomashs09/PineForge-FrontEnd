import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Wallet,
  FileCode,
  FlaskConical,
  Bot,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { buildBreadcrumbLd } from '../components/seoLd';

const steps = [
  {
    icon: Wallet,
    title: 'Connect your MT5 broker',
    minutes: '2 min',
    body: `Go to <strong>Accounts</strong> in your dashboard. Click <strong>Connect Account</strong> and enter your Exness MT5 login number, trading password, and server name (e.g. <code>Exness-MT5Trial6</code> for demo). Your password is used once to verify the account — we never store it.`,
    cta: { to: '/accounts', label: 'Open Accounts' },
    tip: "Don't have a broker yet? Open a free Exness demo account at exness.com (takes 5 minutes). Use a demo for your first month — no real money at risk.",
  },
  {
    icon: FileCode,
    title: 'Pick a strategy from the library',
    minutes: '1 min',
    body: `Browse the <strong>Strategy Library</strong>. We've curated 28+ strategies across trend-following, mean reversion, breakout, and momentum families. Each one ships with the Pine Script source, ideal symbols, and recommended timeframes.`,
    cta: { to: '/strategies', label: 'Browse strategies' },
    tip: 'New to algo trading? Start with EMA Crossover on XAUUSD H1 — it\'s the most-validated strategy/symbol pair in retail.',
  },
  {
    icon: FlaskConical,
    title: 'Backtest on real data',
    minutes: '30 sec',
    body: `Open <strong>Backtest</strong>, pick the strategy and symbol, set a 12-month range. Click <strong>Run</strong>. You'll get equity curve, win rate, profit factor, and max drawdown in seconds — all on real broker OHLC + spread data.`,
    cta: { to: '/backtest', label: 'Run a backtest' },
    tip: 'Look for profit factor > 1.3 and max drawdown < 25%. If you see profit factor 4+, the strategy is probably overfit to that specific period.',
  },
  {
    icon: Bot,
    title: 'Deploy as a live bot',
    minutes: '2 min',
    body: `Go to <strong>My Bots</strong> → <strong>Create Bot</strong>. Pick the strategy, the MT5 account, the symbol, and the timeframe. Click <strong>Deploy</strong>. The bot starts running 24/5 within seconds — and you only pay $0.022/hr while it's active.`,
    cta: { to: '/bots', label: 'Create your first bot' },
    tip: 'Run on demo for 30 days before going live with real money. The bridge from backtest to live trading is where most retail algo traders fail.',
  },
];

const STORAGE_KEY = 'pf_onboarding_progress';

export default function Onboarding() {
  const [active, setActive] = useState(0);
  const [completed, setCompleted] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  function markComplete(idx) {
    const next = new Set(completed);
    next.add(idx);
    setCompleted(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...next])); } catch {}
    if (idx < steps.length - 1) setActive(idx + 1);
  }

  const Step = steps[active];
  const StepIcon = Step.icon;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Get Started — Deploy Your First Trading Bot"
        description="Step-by-step onboarding for new PineForge users. Connect your broker, pick a strategy, backtest, and deploy your first live trading bot in 5 minutes."
        path="/onboarding"
        keywords="trading bot onboarding, first trading bot, MT5 setup, pine script deploy"
        structuredData={[
          buildBreadcrumbLd([
            { name: 'Home', url: '/' },
            { name: 'Get Started', url: '/onboarding' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Deploy your first PineForge trading bot',
            totalTime: 'PT5M',
            step: steps.map((s, i) => ({
              '@type': 'HowToStep',
              position: i + 1,
              name: s.title,
              text: s.body.replace(/<[^>]+>/g, ''),
            })),
          },
        ]}
      />
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 pt-28 pb-16 sm:px-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Deploy your first bot in <span className="text-emerald-400">5 minutes</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
            Four steps. No code required. Each one ships you closer to a live, automated strategy.
          </p>
        </div>

        {/* Progress steps */}
        <ol className="mt-12 grid grid-cols-4 gap-3">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === active;
            const isDone = completed.has(i);
            return (
              <li key={i}>
                <button
                  onClick={() => setActive(i)}
                  className={`group flex w-full flex-col items-start gap-2 rounded-xl border p-4 text-left transition ${
                    isActive
                      ? 'border-emerald-700 bg-emerald-950/30'
                      : isDone
                      ? 'border-emerald-900/40 bg-gray-900/50'
                      : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        isActive ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'
                      }`}>
                        {i + 1}
                      </span>
                    )}
                    <Icon className={`h-4 w-4 ${isActive || isDone ? 'text-emerald-400' : 'text-gray-500'}`} />
                  </div>
                  <p className={`text-sm font-medium ${isActive ? 'text-white' : isDone ? 'text-gray-300' : 'text-gray-400'}`}>
                    {s.title}
                  </p>
                  <p className="text-xs text-gray-500">{s.minutes}</p>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Active step body */}
        <div className="mt-10 rounded-2xl border border-gray-800 bg-gray-900 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-950/40">
              <StepIcon className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">Step {active + 1} of {steps.length} · {Step.minutes}</p>
              <h2 className="mt-1 text-2xl font-bold text-white">{Step.title}</h2>
              <p className="mt-3 text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: Step.body }} />
            </div>
          </div>

          {Step.tip && (
            <div className="mt-5 rounded-lg border border-blue-900/30 bg-blue-950/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">Tip</p>
              <p className="mt-1 text-sm text-gray-300">{Step.tip}</p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              {active > 0 && (
                <button
                  onClick={() => setActive(active - 1)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:border-gray-600 hover:text-white transition"
                >
                  <ArrowLeft className="h-4 w-4" /> Previous
                </button>
              )}
              <button
                onClick={() => markComplete(active)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-700 bg-emerald-950/40 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-950/60 transition"
              >
                <CheckCircle2 className="h-4 w-4" /> Mark done
              </button>
            </div>
            <Link
              to={Step.cta.to}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition"
            >
              {Step.cta.label} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* All complete CTA */}
        {completed.size === steps.length && (
          <div className="mt-8 rounded-2xl border border-emerald-800/40 bg-emerald-950/20 p-8 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
            <h3 className="mt-3 text-2xl font-bold text-white">You shipped your first bot.</h3>
            <p className="mt-2 text-gray-300">
              Watch it run on the dashboard. After 30 days of demo data, ramp to real money carefully — see our backtesting master guide for the playbook.
            </p>
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/dashboard" className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition">
                Open dashboard
              </Link>
              <Link to="/guides/backtesting-master-guide" className="rounded-lg border border-gray-700 px-6 py-2.5 text-sm font-semibold text-gray-300 hover:border-gray-600 hover:text-white transition">
                Read the master guide
              </Link>
            </div>
          </div>
        )}

        {/* Resources */}
        <div className="mt-12">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">More resources</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Link to="/guides/pine-script-complete-guide" className="rounded-lg border border-gray-800 bg-gray-900 p-4 transition hover:border-gray-700">
              <p className="text-sm font-semibold text-white">Pine Script Master Guide</p>
              <p className="mt-1 text-xs text-gray-500">32 min read</p>
            </Link>
            <Link to="/glossary" className="rounded-lg border border-gray-800 bg-gray-900 p-4 transition hover:border-gray-700">
              <p className="text-sm font-semibold text-white">Trading Glossary</p>
              <p className="mt-1 text-xs text-gray-500">22 terms defined</p>
            </Link>
            <Link to="/tools" className="rounded-lg border border-gray-800 bg-gray-900 p-4 transition hover:border-gray-700">
              <p className="text-sm font-semibold text-white">Free Calculators</p>
              <p className="mt-1 text-xs text-gray-500">Position size, R:R, drawdown</p>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
