import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { buildBreadcrumbLd, SITE_URL } from '../components/seoLd';
import glossary, { getGlossaryBySlug } from '../data/glossary';
import { getStrategyBySlug } from '../data/strategies';

const CATEGORY_LABEL = {
  indicator: 'Indicator',
  metric: 'Metric',
  concept: 'Concept',
  instrument: 'Instrument',
};

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
      out.push(<h2 key={i} className="mt-10 mb-3 text-2xl font-bold text-white">{trimmed.slice(3)}</h2>);
      i++; continue;
    }
    if (trimmed.startsWith('### ')) {
      out.push(<h3 key={i} className="mt-6 mb-2 text-lg font-semibold text-white">{trimmed.slice(4)}</h3>);
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
    if (trimmed.startsWith('| ') || trimmed.startsWith('|')) {
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

export default function GlossaryEntry() {
  const { slug } = useParams();
  const term = getGlossaryBySlug(slug);
  if (!term) return <Navigate to="/glossary" />;

  const path = `/glossary/${term.slug}`;
  const definitionLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.title,
    description: term.definition,
    inDefinedTermSet: { '@type': 'DefinedTermSet', name: 'PineForge Trading Glossary', url: `${SITE_URL}/glossary` },
    url: `${SITE_URL}${path}`,
  };
  const breadcrumbLd = buildBreadcrumbLd([
    { name: 'Home', url: '/' },
    { name: 'Glossary', url: '/glossary' },
    { name: term.title, url: path },
  ]);

  const related = (term.related || []).map((s) => glossary.find((g) => g.slug === s)).filter(Boolean);
  const linkedStrategies = (term.linkedStrategies || []).map((s) => getStrategyBySlug(s)).filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title={`${term.title} — Trading Term Defined`}
        description={term.excerpt}
        path={path}
        type="article"
        keywords={`${term.title}, ${term.slug}, trading definition, pine script ${term.slug}`}
        structuredData={[definitionLd, breadcrumbLd]}
      />
      <Navbar />

      <article className="mx-auto max-w-3xl px-4 pt-28 pb-16 sm:px-6">
        <Link to="/glossary" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-400 transition mb-6">
          <ArrowLeft className="h-4 w-4" /> All Terms
        </Link>

        <span className="text-sm font-medium text-emerald-400">{CATEGORY_LABEL[term.category]}</span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
          {term.title}
        </h1>
        <p className="mt-4 text-lg text-gray-300 leading-relaxed">{term.definition}</p>

        <div className="mt-8 prose-pineforge">
          {renderBody(term.body)}
        </div>

        {linkedStrategies.length > 0 && (
          <section className="mt-12 border-t border-gray-800 pt-8">
            <h2 className="text-xl font-bold text-white">Strategies that use {term.title}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {linkedStrategies.map((s) => (
                <Link
                  key={s.slug}
                  to={`/strategies/${s.slug}`}
                  className="group flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-4 transition hover:border-emerald-800/50"
                >
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-emerald-400">{s.name}</p>
                    <p className="mt-1 text-xs text-gray-500">{s.shortDesc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-emerald-400" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-12 border-t border-gray-800 pt-8">
            <h2 className="text-xl font-bold text-white">Related Terms</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/glossary/${r.slug}`}
                  className="group flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-4 transition hover:border-emerald-800/50"
                >
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-emerald-400">{r.title}</p>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">{r.excerpt}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-emerald-400" />
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-16 rounded-2xl border border-emerald-800/30 bg-gradient-to-br from-emerald-950/30 to-gray-900 p-8 text-center">
          <h3 className="text-2xl font-bold text-white">Stop Reading. Start Trading.</h3>
          <p className="mt-2 text-gray-400">PineForge backtests every concept on this site against real market data.</p>
          <Link to="/signup" className="mt-6 inline-block rounded-lg bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition">
            Try It Free
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
}
