import { Link } from 'react-router-dom';
import { ArrowRight, Calculator } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { buildBreadcrumbLd } from '../components/seoLd';
import tools from '../data/tools';

export default function ToolsHub() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Free Trading Calculators — Position Size, Risk-Reward, Drawdown"
        description="Free interactive calculators for traders: position size, risk-reward, drawdown recovery. No signup required."
        path="/tools"
        structuredData={buildBreadcrumbLd([
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
        ])}
      />
      <Navbar />

      <section className="relative overflow-hidden pt-32 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Free <span className="text-emerald-400">Trading Tools</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Interactive calculators for the math that keeps you in the game. No signup, no email gates.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link
              key={t.slug}
              to={`/tools/${t.slug}`}
              className="group flex flex-col rounded-xl border border-gray-800 bg-gray-900 p-6 transition hover:border-emerald-800/50"
            >
              <Calculator className="h-6 w-6 text-emerald-400" />
              <h2 className="mt-3 text-lg font-bold text-white group-hover:text-emerald-400">{t.name}</h2>
              <p className="mt-2 flex-1 text-sm text-gray-400">{t.shortDesc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs text-emerald-400 group-hover:gap-1.5 transition-all">
                Open <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
