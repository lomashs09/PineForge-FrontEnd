import { Link } from 'react-router-dom';
import { Mail, Download, Flame } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { buildBreadcrumbLd } from '../components/seoLd';

export default function Press() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Press Kit — PineForge Logos, Screenshots & Brand Assets"
        description="Download PineForge logos, screenshots, and brand information. Press contact, founder bio, and product facts."
        path="/press"
        structuredData={buildBreadcrumbLd([
          { name: 'Home', url: '/' },
          { name: 'Press', url: '/press' },
        ])}
      />
      <Navbar />

      <section className="relative overflow-hidden pt-32 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Press <span className="text-emerald-400">Kit</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Logos, brand assets, founder bio, and product facts. For press, podcasts, partnerships, and reviews.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <section>
          <h2 className="text-2xl font-bold text-white">About PineForge</h2>
          <p className="mt-3 text-gray-300 leading-relaxed">
            PineForge is a cloud platform for retail traders to write Pine Script strategies, backtest on real OHLC data, and deploy them as live bots on MetaTrader 5 broker accounts. Founded in 2025, headquartered in New Delhi, India.
          </p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Stat label="Founded" value="2025" />
            <Stat label="Headquarters" value="New Delhi, India" />
            <Stat label="Markets supported" value="13 (forex, gold, crypto, indices)" />
            <Stat label="Strategies in library" value="28+" />
            <Stat label="Pricing model" value="Pay-as-you-go" />
            <Stat label="Brokers supported" value="Exness MT5 (more coming)" />
          </dl>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white">Logo</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 p-6">
              <div className="flex h-24 w-full items-center justify-center rounded-lg bg-gray-950">
                <Flame className="h-12 w-12 text-emerald-400" />
                <span className="ml-3 text-3xl font-bold tracking-tight">PineForge</span>
              </div>
              <a
                href="/favicon.svg"
                download
                className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300"
              >
                <Download className="h-4 w-4" /> Download mark (SVG)
              </a>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-800 bg-white p-6">
              <div className="flex h-24 w-full items-center justify-center rounded-lg bg-white">
                <Flame className="h-12 w-12 text-emerald-600" />
                <span className="ml-3 text-3xl font-bold tracking-tight text-gray-900">PineForge</span>
              </div>
              <span className="text-xs text-gray-500">Light variant — for light-coloured backgrounds</span>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white">Brand colours</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {[
              { name: 'Emerald 500', hex: '#10b981', cls: 'bg-emerald-500' },
              { name: 'Emerald 400', hex: '#34d399', cls: 'bg-emerald-400' },
              { name: 'Gray 950', hex: '#030712', cls: 'bg-gray-950 border border-gray-800' },
              { name: 'Gray 900', hex: '#111827', cls: 'bg-gray-900 border border-gray-800' },
            ].map((c) => (
              <div key={c.name} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                <div className={`h-16 w-full rounded-lg ${c.cls}`} />
                <p className="mt-3 text-sm font-semibold text-white">{c.name}</p>
                <p className="text-xs text-gray-500">{c.hex}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white">Founder</h2>
          <p className="mt-3 text-gray-300 leading-relaxed">
            <strong className="text-white">Lomash Sharma</strong> — Founder & CEO. Background in software engineering and quantitative trading. Built PineForge after spending years writing trading bots in MQL5 and wishing the experience could be as simple as Pine Script on TradingView.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white">Press contact</h2>
          <a
            href="mailto:press@getpineforge.com"
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition"
          >
            <Mail className="h-4 w-4" /> press@getpineforge.com
          </a>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white">Useful links</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li><Link to="/about" className="text-emerald-400 underline decoration-emerald-400/30 hover:decoration-emerald-400">About PineForge</Link></li>
            <li><Link to="/changelog" className="text-emerald-400 underline decoration-emerald-400/30 hover:decoration-emerald-400">Changelog</Link></li>
            <li><Link to="/strategies" className="text-emerald-400 underline decoration-emerald-400/30 hover:decoration-emerald-400">Strategy library</Link></li>
            <li><Link to="/blog" className="text-emerald-400 underline decoration-emerald-400/30 hover:decoration-emerald-400">Engineering & strategy blog</Link></li>
          </ul>
        </section>
      </div>

      <Footer />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-base font-semibold text-white">{value}</dd>
    </div>
  );
}
