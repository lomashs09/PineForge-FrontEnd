import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { buildBreadcrumbLd, SITE_URL } from '../components/seoLd';
import { getComparisonBySlug } from '../data/comparisons';

function renderInline(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function CompareDetail() {
  const { slug } = useParams();
  const c = getComparisonBySlug(slug);
  if (!c) return <Navigate to="/compare" />;

  const path = `/compare/${c.slug}`;
  const lds = [
    buildBreadcrumbLd([
      { name: 'Home', url: '/' },
      { name: 'Compare', url: '/compare' },
      { name: `vs ${c.competitor}`, url: path },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: c.title,
      description: c.shortIntro,
      author: { '@type': 'Organization', name: 'PineForge', url: SITE_URL },
      publisher: { '@type': 'Organization', name: 'PineForge', logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${path}` },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title={c.title}
        description={c.shortIntro}
        path={path}
        type="article"
        keywords={`PineForge vs ${c.competitor}, ${c.competitor} alternative, pine script vs ${c.competitor.toLowerCase()}, trading bot comparison`}
        structuredData={lds}
      />
      <Navbar />

      <article className="mx-auto max-w-4xl px-4 pt-28 pb-16 sm:px-6">
        <Link to="/compare" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-400 transition mb-6">
          <ArrowLeft className="h-4 w-4" /> All Comparisons
        </Link>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
          {c.title}
        </h1>
        <p className="mt-6 text-lg text-gray-300 leading-relaxed">{c.longIntro}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/20 p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-300">
              <CheckCircle className="h-5 w-5" /> PineForge wins
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-300">
              {c.pfStrengths.map((s) => <li key={s}>• {s}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <CheckCircle className="h-5 w-5 text-blue-400" /> {c.competitor} wins
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-300">
              {c.competitorStrengths.map((s) => <li key={s}>• {s}</li>)}
            </ul>
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-bold text-white">Side-by-side</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Feature</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-emerald-400">PineForge</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">{c.competitor}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {c.matrix.map((row) => (
                <tr key={row.feature} className="bg-gray-900/50">
                  <td className="px-4 py-3 font-medium text-gray-200">{row.feature}</td>
                  <td className="px-4 py-3 text-emerald-300">{row.pf}</td>
                  <td className="px-4 py-3 text-gray-400">{row.other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 text-2xl font-bold text-white">Verdict</h2>
        <p className="mt-4 text-gray-300 leading-relaxed">{renderInline(c.verdict)}</p>

        <div className="mt-12 rounded-2xl border border-emerald-800/30 bg-gradient-to-br from-emerald-950/30 to-gray-900 p-8 text-center">
          <h3 className="text-2xl font-bold text-white">Try PineForge for free</h3>
          <p className="mt-2 text-gray-400">Pay-as-you-go — no subscription, no commitment.</p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/signup" className="rounded-lg bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition">
              Get Started
            </Link>
            <Link to="/strategies" className="rounded-lg border border-gray-700 px-8 py-3 text-sm font-semibold text-gray-300 hover:border-gray-600 hover:text-white transition">
              Browse strategies
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
