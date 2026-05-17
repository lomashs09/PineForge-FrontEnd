import { Link } from 'react-router-dom';
import { FlaskConical, X, Sparkles } from 'lucide-react';

const DISMISS_KEY = 'pf_first_backtest_dismissed';

export function shouldShowWelcomeCard({ hasBots }) {
  if (hasBots) return false;
  try {
    return localStorage.getItem(DISMISS_KEY) !== '1';
  } catch {
    return true;
  }
}

export function dismissWelcomeCard() {
  try {
    localStorage.setItem(DISMISS_KEY, '1');
  } catch {}
}

function buildBacktestUrl() {
  const today = new Date();
  const lastYear = new Date(today);
  lastYear.setFullYear(today.getFullYear() - 1);
  const fmt = (d) => d.toISOString().slice(0, 10);
  const params = new URLSearchParams({
    strategy_name: 'Gold Hunter V2',
    symbol: 'XAUUSD',
    interval: '1h',
    start: fmt(lastYear),
    end: fmt(today),
    quantity: '3',
  });
  return `/backtest?${params.toString()}`;
}

export default function WelcomeCard({ onDismiss }) {
  function handleDismiss() {
    dismissWelcomeCard();
    onDismiss?.();
  }

  function handleStart() {
    dismissWelcomeCard();
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-700/40 bg-gradient-to-br from-emerald-950/40 via-gray-900 to-gray-900 p-6 sm:p-8">
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss welcome card"
        className="absolute right-3 top-3 rounded-md p-1.5 text-gray-500 transition hover:bg-gray-800 hover:text-gray-300 cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600/20">
          <Sparkles className="h-6 w-6 text-emerald-400" />
        </div>

        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
            Welcome to PineForge
          </p>
          <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
            Start with a backtest, not a live bot.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-300 sm:text-base">
            We've pre-set <strong className="text-white">Gold Hunter V2</strong> on <strong className="text-white">XAUUSD 1H</strong>,
            <span> </span>last 12 months, quantity 3. Run it to see how the engine reports equity curve,
            profit factor, drawdown, and trade-by-trade results — before you ever risk a dollar.
          </p>

          <Link
            to={buildBacktestUrl()}
            onClick={handleStart}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 cursor-pointer"
          >
            <FlaskConical className="h-4 w-4" />
            Run your first backtest
          </Link>
        </div>
      </div>
    </div>
  );
}
