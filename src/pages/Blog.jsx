import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { buildBreadcrumbLd } from '../components/seoLd';
import blogPosts from '../data/blogPosts';

const CATEGORIES = ['All', ...new Set(blogPosts.map((p) => p.category))];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = blogPosts.filter((post) => {
    const matchCat = activeCategory === 'All' || post.category === activeCategory;
    const matchSearch =
      !search ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Trading Bot Blog — Strategies, Tutorials & Pine Script Guides"
        description="Trading strategies, backtesting tutorials, Pine Script guides, and risk management insights for automated trading. Updated weekly."
        path="/blog"
        structuredData={buildBreadcrumbLd([
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
        ])}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            PineForge <span className="text-emerald-400">Blog</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Trading strategies, tutorials, and insights to help you build profitable automated trading bots.
          </p>

          {/* Search */}
          <div className="relative mx-auto mt-8 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-gray-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-emerald-600"
            />
          </div>
        </div>
      </section>

      {/* Category filter */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured post (first one) */}
      {filtered.length > 0 && activeCategory === 'All' && !search && (
        <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link to={`/blog/${filtered[0].slug}`} className="group block">
            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 transition hover:border-emerald-800/50 md:flex">
              <div className="md:w-1/2">
                <img
                  src={filtered[0].image}
                  alt={filtered[0].title}
                  className="h-64 w-full object-cover md:h-full"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col justify-center p-8 md:w-1/2">
                <span className="inline-block w-fit rounded-full bg-emerald-950 px-3 py-1 text-xs font-medium text-emerald-400">
                  {filtered[0].category}
                </span>
                <h2 className="mt-4 text-2xl font-bold text-white group-hover:text-emerald-400 transition sm:text-3xl">
                  {filtered[0].title}
                </h2>
                <p className="mt-3 text-gray-400 line-clamp-3">{filtered[0].excerpt}</p>
                <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                  <span>{new Date(filtered[0].date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {filtered[0].readTime}
                  </span>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-400 group-hover:gap-2 transition-all">
                  Read article <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Post grid */}
      <div className="mx-auto mt-10 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {(activeCategory === 'All' && !search ? filtered.slice(1) : filtered).map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="group">
              <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900 transition hover:border-emerald-800/50">
                <div className="overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-emerald-950 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">{post.readTime}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-white group-hover:text-emerald-400 transition line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-gray-400 line-clamp-3">{post.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 group-hover:gap-1.5 transition-all">
                      Read more <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-500">No articles found. Try a different search or category.</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <section className="border-t border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Automate Your Trading?</h2>
          <p className="mt-4 text-gray-400">
            Join thousands of traders using PineForge to backtest strategies, deploy bots, and trade 24/7.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/signup"
              className="rounded-lg bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition"
            >
              Get Started Free
            </Link>
            <Link
              to="/backtest"
              className="rounded-lg border border-gray-700 px-8 py-3 text-sm font-semibold text-gray-300 hover:border-gray-600 hover:text-white transition"
            >
              Try Backtesting
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
