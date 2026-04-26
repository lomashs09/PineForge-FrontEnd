import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { buildBreadcrumbLd } from '../components/seoLd';
import glossary from '../data/glossary';

const CATEGORY_LABEL = {
  indicator: 'Indicators',
  metric: 'Metrics',
  concept: 'Concepts',
  instrument: 'Instruments',
};

export default function GlossaryHub() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', ...new Set(glossary.map((g) => g.category))];
  const filtered = glossary
    .filter((g) => category === 'All' || g.category === category)
    .filter((g) => !search || g.title.toLowerCase().includes(search.toLowerCase()) || g.excerpt.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Trading Glossary — Indicators, Metrics & Concepts Explained"
        description="Plain-English definitions of every indicator, metric, and concept used in algorithmic trading. EMA, RSI, Sharpe, drawdown, walk-forward, and more — with Pine Script examples."
        path="/glossary"
        keywords="trading glossary, RSI, EMA, MACD, Sharpe ratio, drawdown, profit factor, position sizing, mean reversion, trend following, backtesting"
        structuredData={buildBreadcrumbLd([
          { name: 'Home', url: '/' },
          { name: 'Glossary', url: '/glossary' },
        ])}
      />
      <Navbar />

      <section className="relative overflow-hidden pt-32 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Trading <span className="text-emerald-400">Glossary</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            {glossary.length} terms — from EMA to walk-forward analysis. Plain-English definitions with Pine Script examples and links to the strategies that use them.
          </p>

          <div className="relative mx-auto mt-8 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search a term..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-gray-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-emerald-600"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
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

      <div className="mx-auto mt-10 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <p className="py-20 text-center text-gray-500">No terms match.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((g) => (
              <Link key={g.slug} to={`/glossary/${g.slug}`} className="group">
                <article className="flex h-full flex-col rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-emerald-800/50">
                  <span className="text-xs font-medium text-emerald-400">{CATEGORY_LABEL[g.category]}</span>
                  <h3 className="mt-2 text-lg font-bold text-white group-hover:text-emerald-400">
                    {g.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-gray-400 line-clamp-3">{g.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs text-emerald-400 group-hover:gap-1.5 transition-all">
                    Read <ArrowRight className="h-3 w-3" />
                  </span>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
