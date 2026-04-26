import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { buildBreadcrumbLd } from '../components/seoLd';
import symbols from '../data/symbols';

const CATEGORY_LABEL = {
  commodity: 'Commodities',
  forex: 'Forex',
  crypto: 'Crypto',
  index: 'Indices',
};

const VOLATILITY_BADGE = {
  low: 'bg-blue-950/40 text-blue-300',
  medium: 'bg-emerald-950/40 text-emerald-300',
  high: 'bg-amber-950/40 text-amber-300',
  'very-high': 'bg-red-950/40 text-red-300',
};

export default function SymbolHub() {
  const grouped = symbols.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Symbols — Trade Forex, Gold, Crypto & Indices With Pine Script Bots"
        description={`${symbols.length} markets supported on PineForge — XAUUSD, EUR/USD, GBP/USD, BTC/USD, ETH/USD, US500, USTEC and more. See best strategies and ideal timeframes per symbol.`}
        path="/symbols"
        keywords="trading symbols, forex pairs, XAUUSD, EURUSD, BTCUSD, US500, MT5 symbols"
        structuredData={[
          buildBreadcrumbLd([
            { name: 'Home', url: '/' },
            { name: 'Symbols', url: '/symbols' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'PineForge Supported Symbols',
            numberOfItems: symbols.length,
          },
        ]}
      />
      <Navbar />

      <section className="relative overflow-hidden pt-32 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Trade <span className="text-emerald-400">{symbols.length}</span> Markets
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Forex majors, gold, silver, Bitcoin, Ethereum, and the largest US indices — all with broker-grade execution via MetaTrader 5.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {Object.entries(grouped).map(([category, items]) => (
          <section key={category} className="mt-12 first:mt-0">
            <h2 className="text-2xl font-bold text-white">{CATEGORY_LABEL[category]}</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((s) => (
                <Link key={s.slug} to={`/symbols/${s.slug}`} className="group">
                  <article className="flex h-full flex-col rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-emerald-800/50">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">{s.display}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${VOLATILITY_BADGE[s.volatility]}`}>
                        {s.volatility}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-400">{s.name}</p>
                    <p className="mt-3 flex-1 text-sm text-gray-400 line-clamp-3">{s.summary}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs text-emerald-400 group-hover:gap-1.5 transition-all">
                      View strategies <ArrowRight className="h-3 w-3" />
                    </span>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Footer />
    </div>
  );
}
