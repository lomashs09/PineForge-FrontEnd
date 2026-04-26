import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, TrendingUp, Activity, Clock, Target } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { buildBreadcrumbLd, SITE_URL } from '../components/seoLd';
import { getSymbolBySlug } from '../data/symbols';
import strategies from '../data/strategies';

const CATEGORY_LABEL = {
  commodity: 'Commodity',
  forex: 'Forex',
  crypto: 'Crypto',
  index: 'Index',
};

export default function SymbolDetail() {
  const { slug } = useParams();
  const symbol = getSymbolBySlug(slug);
  if (!symbol) return <Navigate to="/symbols" />;

  const path = `/symbols/${symbol.slug}`;
  const matchingStrategies = strategies.filter((s) => s.appliesTo.includes(symbol.category));

  const title = `${symbol.display} (${symbol.name}) — Trading Strategies & Pine Script Bots`;
  const description = `${symbol.summary} View ${matchingStrategies.length} ready-to-deploy Pine Script strategies optimised for ${symbol.display}.`;

  const lds = [
    buildBreadcrumbLd([
      { name: 'Home', url: '/' },
      { name: 'Symbols', url: '/symbols' },
      { name: symbol.display, url: path },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'FinancialProduct',
      name: `${symbol.display} (${symbol.name})`,
      description: symbol.summary,
      url: `${SITE_URL}${path}`,
      category: CATEGORY_LABEL[symbol.category],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title={title}
        description={description}
        path={path}
        keywords={`${symbol.display}, ${symbol.name}, ${symbol.display} trading strategy, ${symbol.display} pine script, ${symbol.display} bot`}
        structuredData={lds}
      />
      <Navbar />

      <article className="mx-auto max-w-4xl px-4 pt-28 pb-16 sm:px-6">
        <Link to="/symbols" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-400 transition mb-6">
          <ArrowLeft className="h-4 w-4" /> All Symbols
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-emerald-400">{CATEGORY_LABEL[symbol.category]}</span>
          <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-400 capitalize">{symbol.volatility} volatility</span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
          {symbol.display} <span className="text-gray-500">({symbol.name})</span>
        </h1>

        <p className="mt-6 text-lg text-gray-300 leading-relaxed">{symbol.summary}</p>

        <div className="mt-8 grid gap-3 rounded-2xl border border-gray-800 bg-gray-900 p-6 sm:grid-cols-2">
          <KeyFact icon={Target} label="Symbol" value={symbol.display} />
          <KeyFact icon={TrendingUp} label="Category" value={CATEGORY_LABEL[symbol.category]} />
          <KeyFact icon={Activity} label="Volatility" value={symbol.volatility} />
          <KeyFact icon={Clock} label="Trading Sessions" value={symbol.sessions} />
        </div>

        <h2 className="mt-12 text-2xl font-bold text-white">Best Strategies for {symbol.display}</h2>
        <p className="mt-2 text-gray-400">
          {matchingStrategies.length} strategies in our library are designed for {CATEGORY_LABEL[symbol.category].toLowerCase()} markets like {symbol.display}.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {matchingStrategies.map((s) => (
            <Link
              key={s.slug}
              to={`/strategies/${symbol.slug}-${s.slug}`}
              className="group flex flex-col rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-emerald-800/50"
            >
              <span className="text-xs font-medium text-emerald-400 capitalize">{s.family.replace('-', ' ')}</span>
              <h3 className="mt-2 text-lg font-bold text-white group-hover:text-emerald-400">{s.name}</h3>
              <p className="mt-2 flex-1 text-sm text-gray-400 line-clamp-3">{s.shortDesc}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>{s.timeframes.join(' · ')}</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 group-hover:gap-1.5 transition-all">
                  View <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-emerald-800/30 bg-gradient-to-br from-emerald-950/30 to-gray-900 p-8 text-center">
          <h3 className="text-2xl font-bold text-white">Backtest a {symbol.display} strategy in 30 seconds</h3>
          <p className="mt-2 text-gray-400">Sign up, pick a strategy, and run a 1-year backtest on real {symbol.display} data — no card required.</p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/signup" className="rounded-lg bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition">
              Backtest Free
            </Link>
            <Link to="/strategies" className="rounded-lg border border-gray-700 px-8 py-3 text-sm font-semibold text-gray-300 hover:border-gray-600 hover:text-white transition">
              Browse all strategies
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}

function KeyFact({ icon, label, value }) {
  const Icon = icon;
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 text-emerald-400" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
        <p className="mt-0.5 text-sm text-gray-200 capitalize">{value}</p>
      </div>
    </div>
  );
}
