import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Activity,
  Zap,
  Repeat,
  CheckCircle,
  XCircle,
  Clock,
  Target,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { buildBreadcrumbLd, SITE_URL } from '../components/seoLd';
import { resolveStrategySlug, getRelatedPages } from '../data/strategyPages';

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

const CATEGORY_PROSE = {
  commodity:
    'Commodities like gold and silver have well-defined fundamental drivers — central bank policy, real yields, USD strength. Combined with the technical setup below, this gives the strategy two independent edges.',
  forex:
    'Forex pairs trade with tight spreads, deep liquidity, and predictable session-based behavior. The strategy below earns its edge during the active sessions for this pair.',
  crypto:
    "Crypto trades 24/7 with no central market. The strategy below capitalizes on weekend liquidity gaps and the asset's tendency to make sustained directional moves.",
  index:
    'Equity indices reflect aggregate corporate earnings, sentiment, and Fed policy. They trend more cleanly than individual stocks and gap less than commodities.',
};

export default function StrategyDetail() {
  const { slug } = useParams();
  const resolved = resolveStrategySlug(slug);

  if (!resolved) return <Navigate to="/strategies" />;

  if (resolved.kind === 'strategy') {
    return <StrategyOnly strategy={resolved.strategy} />;
  }

  return <ComboPage symbol={resolved.symbol} strategy={resolved.strategy} />;
}

function ComboPage({ symbol, strategy }) {
  const Icon = FAMILY_ICON[strategy.family] || TrendingUp;
  const related = getRelatedPages(symbol, strategy);
  const path = `/strategies/${symbol.slug}-${strategy.slug}`;
  const title = `${strategy.name} for ${symbol.display} (${symbol.name}) — Pine Script Strategy`;
  const description = `${strategy.shortDesc} Sample Pine Script, recommended timeframes for ${symbol.display}, and one-click backtesting on PineForge.`;

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description,
    about: { '@type': 'Thing', name: `${symbol.display} ${strategy.name}` },
    proficiencyLevel: 'Beginner',
    author: { '@type': 'Organization', name: 'PineForge', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'PineForge',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${path}` },
  };

  const breadcrumbLd = buildBreadcrumbLd([
    { name: 'Home', url: '/' },
    { name: 'Strategies', url: '/strategies' },
    { name: `${strategy.name} on ${symbol.display}`, url: path },
  ]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title={title}
        description={description}
        path={path}
        keywords={`${symbol.display} ${strategy.name}, ${symbol.display} pine script, ${symbol.name} trading strategy, ${strategy.name} bot, ${strategy.indicators.join(', ')}`}
        type="article"
        structuredData={[articleLd, breadcrumbLd]}
      />
      <Navbar />

      <article className="mx-auto max-w-4xl px-4 pt-28 pb-16 sm:px-6">
        {/* Breadcrumb */}
        <Link
          to="/strategies"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-400 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> All Strategies
        </Link>

        {/* Header */}
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-400">{FAMILY_LABEL[strategy.family]}</span>
          <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-400">{symbol.display}</span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
          {strategy.name} for {symbol.display} <span className="text-gray-500">({symbol.name})</span>
        </h1>

        <p className="mt-6 text-lg text-gray-300 leading-relaxed">
          {strategy.shortDesc}
        </p>

        {/* Key facts */}
        <div className="mt-8 grid gap-3 rounded-2xl border border-gray-800 bg-gray-900 p-6 sm:grid-cols-2">
          <KeyFact icon={Target} label="Indicators" value={strategy.indicators.join(', ')} />
          <KeyFact icon={Clock} label="Recommended Timeframes" value={strategy.timeframes.join(', ')} />
          <KeyFact icon={Activity} label="Symbol Volatility" value={symbol.volatility} />
          <KeyFact icon={TrendingUp} label="Trading Sessions" value={symbol.sessions} />
        </div>

        {/* Why this combo */}
        <h2 className="mt-12 text-2xl font-bold text-white">
          Why {strategy.name} Works on {symbol.display}
        </h2>
        <p className="mt-4 text-gray-300 leading-relaxed">{strategy.longDesc}</p>
        <p className="mt-4 text-gray-300 leading-relaxed">{symbol.summary}</p>
        <p className="mt-4 text-gray-300 leading-relaxed">{CATEGORY_PROSE[symbol.category]}</p>

        {/* Best for / Avoid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/20 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <CheckCircle className="h-4 w-4" /> Best For
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm text-gray-300">
              {strategy.bestFor.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-amber-900/30 bg-amber-950/10 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-300">
              <XCircle className="h-4 w-4" /> Avoid In
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm text-gray-300">
              {strategy.avoidFor.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pine code */}
        <h2 className="mt-12 text-2xl font-bold text-white">Pine Script Source</h2>
        <p className="mt-2 text-sm text-gray-400">
          Copy this into PineForge — backtest on {symbol.display} or any supported symbol, then deploy as a live bot.
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-800">
          <div className="flex items-center justify-between bg-gray-800 px-4 py-2 text-xs text-gray-400">
            <span>{strategy.slug}.pine</span>
            <span>Pine Script v5</span>
          </div>
          <pre className="overflow-x-auto bg-gray-900 p-4 text-sm leading-relaxed">
            <code className="font-mono text-emerald-300">{strategy.pineCode}</code>
          </pre>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-emerald-800/30 bg-gradient-to-br from-emerald-950/30 to-gray-900 p-8 text-center">
          <h3 className="text-2xl font-bold text-white">
            Backtest {strategy.name} on {symbol.display} in 30 seconds
          </h3>
          <p className="mt-2 text-gray-400">
            Sign up for PineForge, paste this Pine Script, and run a 1-year backtest on real {symbol.display} data — no credit card required.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/signup"
              className="rounded-lg bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition"
            >
              Backtest Free
            </Link>
            <Link
              to="/pricing"
              className="rounded-lg border border-gray-700 px-8 py-3 text-sm font-semibold text-gray-300 hover:border-gray-600 hover:text-white transition"
            >
              See Pricing
            </Link>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-gray-800 pt-12">
            <h2 className="text-xl font-bold text-white">Related Strategies</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  to={p.path}
                  className="group flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-4 transition hover:border-emerald-800/50"
                >
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-emerald-400">
                      {p.strategy.name} on {p.symbol.display}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">{FAMILY_LABEL[p.strategy.family]}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-emerald-400" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <Footer />
    </div>
  );
}

function StrategyOnly({ strategy }) {
  const Icon = FAMILY_ICON[strategy.family] || TrendingUp;
  const path = `/strategies/${strategy.slug}`;
  const title = `${strategy.name} — Pine Script Strategy Guide`;
  const description = `${strategy.shortDesc} Pine Script source, ideal timeframes, and which markets it works on.`;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title={title}
        description={description}
        path={path}
        keywords={`${strategy.name}, pine script, ${strategy.indicators.join(', ')}, trading strategy`}
        type="article"
        structuredData={buildBreadcrumbLd([
          { name: 'Home', url: '/' },
          { name: 'Strategies', url: '/strategies' },
          { name: strategy.name, url: path },
        ])}
      />
      <Navbar />

      <article className="mx-auto max-w-4xl px-4 pt-28 pb-16 sm:px-6">
        <Link
          to="/strategies"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-400 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> All Strategies
        </Link>

        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-400">{FAMILY_LABEL[strategy.family]}</span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
          {strategy.name}
        </h1>

        <p className="mt-6 text-lg text-gray-300 leading-relaxed">{strategy.shortDesc}</p>
        <p className="mt-4 text-gray-300 leading-relaxed">{strategy.longDesc}</p>

        <div className="mt-8 overflow-hidden rounded-xl border border-gray-800">
          <div className="flex items-center justify-between bg-gray-800 px-4 py-2 text-xs text-gray-400">
            <span>{strategy.slug}.pine</span>
            <span>Pine Script v5</span>
          </div>
          <pre className="overflow-x-auto bg-gray-900 p-4 text-sm leading-relaxed">
            <code className="font-mono text-emerald-300">{strategy.pineCode}</code>
          </pre>
        </div>

        <div className="mt-8 rounded-2xl border border-emerald-800/30 bg-gradient-to-br from-emerald-950/30 to-gray-900 p-8 text-center">
          <h3 className="text-2xl font-bold text-white">Deploy {strategy.name} as a Live Bot</h3>
          <p className="mt-2 text-gray-400">Backtest on real data, then run it 24/7 on your MT5 account.</p>
          <Link
            to="/signup"
            className="mt-6 inline-block rounded-lg bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition"
          >
            Get Started Free
          </Link>
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
        <p className="mt-0.5 text-sm text-gray-200">{value}</p>
      </div>
    </div>
  );
}
