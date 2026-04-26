import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { buildBreadcrumbLd, SITE_URL } from '../components/seoLd';
import { getPillarBySlug } from '../data/pillars';

function renderInline(text) {
  const parts = text.split(/(\*\*.*?\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="rounded bg-gray-800 px-1.5 py-0.5 text-sm text-emerald-300 font-mono">{part.slice(1, -1)}</code>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = link[2];
      const isExt = href.startsWith('http');
      return (
        <a
          key={i}
          href={href}
          {...(isExt ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="text-emerald-400 underline decoration-emerald-400/30 hover:decoration-emerald-400 transition"
        >
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

function renderBody(body) {
  const lines = body.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) { i++; continue; }

    if (trimmed.startsWith('## ')) {
      out.push(<h2 key={i} className="mt-12 mb-4 text-3xl font-bold text-white">{trimmed.slice(3)}</h2>);
      i++; continue;
    }
    if (trimmed.startsWith('### ')) {
      out.push(<h3 key={i} className="mt-8 mb-3 text-xl font-semibold text-white">{trimmed.slice(4)}</h3>);
      i++; continue;
    }
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3);
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      out.push(
        <div key={`code-${i}`} className="my-6 overflow-hidden rounded-lg border border-gray-800">
          <div className="flex items-center justify-between bg-gray-800 px-4 py-2 text-xs text-gray-400">
            <span>{lang || 'text'}</span>
          </div>
          <pre className="overflow-x-auto bg-gray-900 p-4 text-sm leading-relaxed">
            <code className="font-mono text-emerald-300">{codeLines.join('\n')}</code>
          </pre>
        </div>,
      );
      continue;
    }
    if (trimmed.startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        const header = tableLines[0].split('|').filter((c) => c.trim()).map((c) => c.trim());
        const rows = tableLines.slice(2).map((row) => row.split('|').filter((c) => c.trim()).map((c) => c.trim()));
        out.push(
          <div key={`tbl-${i}`} className="my-6 overflow-x-auto">
            <table className="w-full text-sm border border-gray-800 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800">
                  {header.map((h, hi) => <th key={hi} className="px-4 py-2 text-left font-medium text-gray-300">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {rows.map((r, ri) => (
                  <tr key={ri} className="bg-gray-900/50">
                    {r.map((c, ci) => <td key={ci} className="px-4 py-2 text-gray-300">{renderInline(c)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        );
        continue;
      }
    }
    if (/^\d+\.\s/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ''));
        i++;
      }
      out.push(<ol key={`ol-${i}`} className="my-4 ml-6 list-decimal space-y-1.5 text-gray-300">{items.map((it, ii) => <li key={ii}>{renderInline(it)}</li>)}</ol>);
      continue;
    }
    if (trimmed.startsWith('- ')) {
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      out.push(<ul key={`ul-${i}`} className="my-4 ml-6 list-disc space-y-1.5 text-gray-300">{items.map((it, ii) => <li key={ii}>{renderInline(it)}</li>)}</ul>);
      continue;
    }
    out.push(<p key={i} className="mb-4 text-gray-300 leading-relaxed">{renderInline(trimmed)}</p>);
    i++;
  }
  return out;
}

export default function PillarPage() {
  const { slug } = useParams();
  const pillar = getPillarBySlug(slug);
  if (!pillar) return <Navigate to="/blog" />;

  const path = `/guides/${pillar.slug}`;
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: pillar.title,
    description: pillar.excerpt,
    image: pillar.image ? `${SITE_URL}${pillar.image}` : undefined,
    datePublished: pillar.updated,
    dateModified: pillar.updated,
    author: { '@type': 'Organization', name: 'PineForge', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'PineForge', logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${path}` },
    keywords: pillar.keywords,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title={pillar.title}
        description={pillar.excerpt}
        path={path}
        image={pillar.image}
        type="article"
        publishedTime={pillar.updated}
        modifiedTime={pillar.updated}
        keywords={pillar.keywords}
        structuredData={[
          articleLd,
          buildBreadcrumbLd([
            { name: 'Home', url: '/' },
            { name: 'Guides', url: '/guides' },
            { name: pillar.title, url: path },
          ]),
        ]}
      />
      <Navbar />

      {pillar.image && (
        <div className="relative pt-16">
          <div className="h-64 w-full overflow-hidden sm:h-80 md:h-96">
            <img
              src={pillar.image}
              alt={pillar.title}
              className="h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
          </div>
        </div>
      )}

      <article className="relative -mt-32 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-16">
        <Link to="/guides" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-400 transition mb-6">
          <ArrowLeft className="h-4 w-4" /> All Guides
        </Link>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-medium text-emerald-400">
            Master Guide
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            Updated {new Date(pillar.updated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {pillar.readTime}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
          {pillar.title}
        </h1>

        <p className="mt-6 text-lg text-gray-300 leading-relaxed">{pillar.excerpt}</p>

        {/* TOC */}
        {pillar.tableOfContents && (
          <nav aria-label="Table of contents" className="mt-10 rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Table of Contents</h2>
            <ol className="mt-3 space-y-1.5 text-sm">
              {pillar.tableOfContents.map((item, i) => (
                <li key={i} className="text-gray-300">
                  <span className="text-gray-600 mr-2">{i + 1}.</span>{item}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="prose-pineforge mt-10">
          {renderBody(pillar.body)}
        </div>

        <div className="mt-12 rounded-2xl border border-emerald-800/30 bg-gradient-to-br from-emerald-950/30 to-gray-900 p-8 text-center">
          <h3 className="text-2xl font-bold text-white">Stop reading. Start trading.</h3>
          <p className="mt-2 text-gray-400">Pick a strategy, backtest in 30 seconds, deploy in 2 minutes.</p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/signup" className="rounded-lg bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition">
              Get started free
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
