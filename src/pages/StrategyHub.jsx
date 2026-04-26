import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, TrendingUp, Activity, Zap, Repeat } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { buildBreadcrumbLd } from '../components/seoLd';
import strategies from '../data/strategies';
import symbols from '../data/symbols';
import { getAllStrategyPages } from '../data/strategyPages';

const FAMILY_LABEL = {
  'trend-following': 'Trend Following',
  'mean-reversion': 'Mean Reversion',
  breakout: 'Breakout',
  momentum: 'Momentum',
};

const FAMILY_ICON = {
  'trend-following': TrendingUp,
  'mean-reversion': Repeat,
  breakout: Zap,
  momentum: Activity,
};

const CATEGORY_LABEL = {
  commodity: 'Commodities',
  forex: 'Forex',
  crypto: 'Crypto',
  index: 'Indices',
};

export default function StrategyHub() {
  const allPages = useMemo(() => getAllStrategyPages(), []);
  const [search, setSearch] = useState('');
  const [family, setFamily] = useState('All');
  const [category, setCategory] = useState('All');

  const families = ['All', ...Array.from(new Set(strategies.map((s) => s.family)))];
  const categories = ['All', ...Array.from(new Set(symbols.map((s) => s.category)))];

  const filtered = allPages.filter((p) => {
    if (family !== 'All' && p.strategy.family !== family) return false;
    if (category !== 'All' && p.symbol.category !== category) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !p.strategy.name.toLowerCase().includes(q) &&
        !p.symbol.display.toLowerCase().includes(q) &&
        !p.symbol.name.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Trading Strategy Library — Pine Script Strategies for Every Market"
        description={`Browse ${allPages.length}+ ready-to-deploy trading strategies for gold, forex, crypto, and indices. Each strategy ships with Pine Script source, ideal timeframes, and one-click backtest.`}
        path="/strategies"
        keywords="pine script strategies, trading bot strategies, XAUUSD strategy, forex strategies, crypto trading strategies, algo strategies"
        structuredData={[
          buildBreadcrumbLd([
            { name: 'Home', url: '/' },
            { name: 'Strategies', url: '/strategies' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'PineForge Strategy Library',
            description: 'Pine Script trading strategies for forex, gold, crypto, and indices.',
            numberOfItems: allPages.length,
          },
        ]}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Strategy <span className="text-emerald-400">Library</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            {allPages.length} ready-to-deploy Pine Script strategies across {symbols.length} symbols. Backtest in seconds, deploy live in minutes.
          </p>

          <div className="relative mx-auto mt-8 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search strategy or symbol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-gray-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-emerald-600"
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Family:</span>
            {families.map((f) => (
              <button
                key={f}
                onClick={() => setFamily(f)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  family === f
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {f === 'All' ? 'All' : FAMILY_LABEL[f] || f}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Market:</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  category === c
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {c === 'All' ? 'All' : CATEGORY_LABEL[c] || c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="mx-auto mt-10 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <p className="py-20 text-center text-gray-500">No strategies match those filters.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => {
              const Icon = FAMILY_ICON[p.strategy.family] || TrendingUp;
              return (
                <Link key={p.slug} to={p.path} className="group">
                  <article className="flex h-full flex-col rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-emerald-800/50">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-medium text-emerald-400">
                        {FAMILY_LABEL[p.strategy.family]}
                      </span>
                      <span className="ml-auto rounded-full bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-400">
                        {p.symbol.display}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-white group-hover:text-emerald-400">
                      {p.strategy.name} on {p.symbol.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-gray-400 line-clamp-3">
                      {p.strategy.shortDesc}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <span>{p.strategy.timeframes.join(' · ')}</span>
                      <span className="inline-flex items-center gap-1 text-emerald-400 group-hover:gap-1.5 transition-all">
                        View <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
