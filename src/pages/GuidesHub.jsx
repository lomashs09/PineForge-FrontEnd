import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { buildBreadcrumbLd } from '../components/seoLd';
import pillars from '../data/pillars';

export default function GuidesHub() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Master Guides — Pine Script, Algorithmic Trading & Backtesting"
        description="In-depth master guides covering Pine Script, algorithmic trading, and backtesting. ~30 min reads each, written for retail traders."
        path="/guides"
        keywords="trading guides, pine script guide, algorithmic trading guide, backtesting guide"
        structuredData={buildBreadcrumbLd([
          { name: 'Home', url: '/' },
          { name: 'Guides', url: '/guides' },
        ])}
      />
      <Navbar />

      <section className="relative overflow-hidden pt-32 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Master <span className="text-emerald-400">Guides</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Long-form references for the topics that matter most. Each one is the single resource you'd want to give a serious beginner.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {pillars.map((p) => (
            <Link
              key={p.slug}
              to={`/guides/${p.slug}`}
              className="group block overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 transition hover:border-emerald-800/50"
            >
              <div className="flex flex-col md:flex-row">
                {p.image && (
                  <div className="relative md:w-2/5">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-48 w-full object-cover md:h-full"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col justify-center p-7 md:p-8">
                  <span className="inline-block w-fit rounded-full bg-emerald-950 px-3 py-1 text-xs font-medium text-emerald-400">
                    Master Guide
                  </span>
                  <h2 className="mt-3 text-2xl font-bold text-white group-hover:text-emerald-400 transition sm:text-3xl">
                    {p.title}
                  </h2>
                  <p className="mt-3 text-gray-400 line-clamp-3">{p.excerpt}</p>
                  <div className="mt-5 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {p.readTime}
                    </span>
                    <span>·</span>
                    <span>{p.tableOfContents?.length || 0} sections</span>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-400 group-hover:gap-2 transition-all">
                    Read guide <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
