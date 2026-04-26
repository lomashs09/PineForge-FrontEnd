import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { buildBreadcrumbLd } from '../components/seoLd';
import comparisons from '../data/comparisons';

export default function CompareHub() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Compare PineForge vs TradingView, 3Commas, MetaEditor & More"
        description="Honest, side-by-side comparisons of PineForge against the major alternatives — TradingView, 3Commas, MetaEditor (MQL5), and Quantower."
        path="/compare"
        structuredData={buildBreadcrumbLd([
          { name: 'Home', url: '/' },
          { name: 'Compare', url: '/compare' },
        ])}
      />
      <Navbar />

      <section className="relative overflow-hidden pt-32 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            How PineForge <span className="text-emerald-400">Compares</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Honest side-by-side comparisons. Each tool has its strengths — pick the one that fits your workflow.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2">
          {comparisons.map((c) => (
            <Link
              key={c.slug}
              to={`/compare/${c.slug}`}
              className="group flex flex-col rounded-xl border border-gray-800 bg-gray-900 p-6 transition hover:border-emerald-800/50"
            >
              <h2 className="text-xl font-bold text-white group-hover:text-emerald-400">
                PineForge vs {c.competitor}
              </h2>
              <p className="mt-2 flex-1 text-sm text-gray-400 line-clamp-3">{c.shortIntro}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-emerald-400 group-hover:gap-1.5 transition-all">
                Read comparison <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
