import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Tag, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { buildArticleLd, buildBreadcrumbLd } from '../components/seoLd';
import blogPosts from '../data/blogPosts';

export default function BlogPost() {
  const { slug } = useParams();
  const postIndex = blogPosts.findIndex((p) => p.slug === slug);
  const post = blogPosts[postIndex];

  if (!post) return <Navigate to="/blog" />;

  // Related posts: same category or adjacent posts
  const related = blogPosts
    .filter((p) => p.slug !== slug)
    .sort((a, b) => (a.category === post.category ? -1 : 1))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.image}
        type="article"
        publishedTime={post.date}
        modifiedTime={post.date}
        keywords={post.keywords?.join(', ')}
        structuredData={[
          buildArticleLd(post),
          buildBreadcrumbLd([
            { name: 'Home', url: '/' },
            { name: 'Blog', url: '/blog' },
            { name: post.title, url: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <Navbar />

      {/* Hero image */}
      <div className="relative pt-16">
        <div className="h-64 w-full overflow-hidden sm:h-80 md:h-96">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        </div>
      </div>

      {/* Article */}
      <article className="relative -mt-32 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-16">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-400 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-medium text-emerald-400">
            {post.category}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime}
          </span>
        </div>

        {/* Title */}
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
          {post.title}
        </h1>

        {/* Author */}
        <div className="mt-6 flex items-center gap-3 border-b border-gray-800 pb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
            PF
          </div>
          <div>
            <p className="text-sm font-medium text-white">PineForge Team</p>
            <p className="text-xs text-gray-500">Automated Trading Platform</p>
          </div>
        </div>

        {/* Content */}
        <div className="prose-pineforge mt-8">
          {post.content.split('\n').map((line, i) => {
            const trimmed = line.trim();
            if (!trimmed) return null;

            // H2
            if (trimmed.startsWith('## ')) {
              return (
                <h2 key={i} className="mt-10 mb-4 text-2xl font-bold text-white">
                  {trimmed.slice(3)}
                </h2>
              );
            }
            // H3
            if (trimmed.startsWith('### ')) {
              return (
                <h3 key={i} className="mt-8 mb-3 text-xl font-semibold text-white">
                  {trimmed.slice(4)}
                </h3>
              );
            }
            // Inline image: ![alt text](/path/to/image.png)
            const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
            if (imgMatch) {
              return (
                <figure key={i} className="my-8">
                  <img
                    src={imgMatch[2]}
                    alt={imgMatch[1]}
                    className="w-full rounded-xl border border-gray-800"
                    loading="lazy"
                  />
                  {imgMatch[1] && (
                    <figcaption className="mt-2 text-center text-xs text-gray-500">{imgMatch[1]}</figcaption>
                  )}
                </figure>
              );
            }
            // Code block start/end
            if (trimmed.startsWith('```')) {
              return null; // handled below
            }
            // Bullet
            if (trimmed.startsWith('- **')) {
              const match = trimmed.match(/^- \*\*(.+?)\*\*:?\s*(.*)$/);
              if (match) {
                return (
                  <li key={i} className="ml-4 mb-2 text-gray-300 list-disc">
                    <strong className="text-white">{match[1]}</strong>{match[2] ? `: ${match[2]}` : ''}
                  </li>
                );
              }
            }
            if (trimmed.startsWith('- ')) {
              return (
                <li key={i} className="ml-4 mb-2 text-gray-300 list-disc">
                  {trimmed.slice(2)}
                </li>
              );
            }
            // Numbered
            if (/^\d+\.\s/.test(trimmed)) {
              return (
                <li key={i} className="ml-4 mb-2 text-gray-300 list-decimal">
                  {renderInline(trimmed.replace(/^\d+\.\s/, ''))}
                </li>
              );
            }
            // Table separator row (skip)
            if (/^\|[-\s|:]+\|$/.test(trimmed)) {
              return null;
            }
            // Table row
            if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
              return null; // handled by renderTables below
            }

            return (
              <p key={i} className="mb-4 text-gray-300 leading-relaxed">
                {renderInline(trimmed)}
              </p>
            );
          })}

          {/* Render code blocks */}
          {renderCodeBlocks(post.content)}
          {/* Render tables */}
          {renderTables(post.content)}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-emerald-800/30 bg-gradient-to-br from-emerald-950/30 to-gray-900 p-8 text-center">
          <h3 className="text-2xl font-bold text-white">Start Trading Smarter</h3>
          <p className="mt-2 text-gray-400">
            Build, backtest, and deploy your strategies with PineForge. No coding experience required.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/signup"
              className="rounded-lg bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition"
            >
              Create Free Account
            </Link>
            <Link
              to="/backtest"
              className="rounded-lg border border-gray-700 px-8 py-3 text-sm font-semibold text-gray-300 hover:border-gray-600 hover:text-white transition"
            >
              Try Backtesting
            </Link>
          </div>
        </div>
      </article>

      {/* Related posts */}
      <section className="border-t border-gray-800 bg-gray-900/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white">Related Articles</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="group">
                <article className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900 transition hover:border-emerald-800/50">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-40 w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="p-5">
                    <span className="text-xs text-emerald-400">{p.category}</span>
                    <h3 className="mt-2 text-base font-bold text-white group-hover:text-emerald-400 transition line-clamp-2">
                      {p.title}
                    </h3>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-400">
                      Read more <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/** Render inline bold, code, and links */
function renderInline(text) {
  // Split on **bold**, `code`, and [link](url)
  const parts = text.split(/(\*\*.*?\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="rounded bg-gray-800 px-1.5 py-0.5 text-sm text-emerald-300 font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const href = linkMatch[2];
      const isExternal = href.startsWith('http');
      if (isExternal) {
        return (
          <a key={i} href={href} target="_blank" rel="noopener noreferrer"
             className="text-emerald-400 underline decoration-emerald-400/30 hover:decoration-emerald-400 transition">
            {linkMatch[1]}
          </a>
        );
      }
      // Internal link — use React Router Link import would be complex here, use <a>
      return (
        <a key={i} href={href}
           className="text-emerald-400 underline decoration-emerald-400/30 hover:decoration-emerald-400 transition">
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

/** Extract and render code blocks from content */
function renderCodeBlocks(content) {
  const blocks = [];
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    blocks.push({ lang: match[1] || 'text', code: match[2].trim() });
  }
  if (blocks.length === 0) return null;

  return blocks.map((block, i) => (
    <div key={`code-${i}`} className="my-6 overflow-hidden rounded-lg border border-gray-800">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
        <span className="text-xs font-medium text-gray-400">{block.lang}</span>
      </div>
      <pre className="overflow-x-auto bg-gray-900 p-4 text-sm leading-relaxed">
        <code className="text-emerald-300 font-mono">{block.code}</code>
      </pre>
    </div>
  ));
}

/** Extract and render markdown tables from content */
function renderTables(content) {
  const tables = [];
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      // Found start of a table
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        // Parse header
        const header = tableLines[0].split('|').filter(c => c.trim()).map(c => c.trim());
        // Skip separator row (index 1)
        const rows = tableLines.slice(2).map(row =>
          row.split('|').filter(c => c.trim()).map(c => c.trim())
        );
        tables.push({ header, rows });
      }
    } else {
      i++;
    }
  }

  if (tables.length === 0) return null;

  return tables.map((table, ti) => (
    <div key={`table-${ti}`} className="my-8 overflow-x-auto">
      <table className="w-full text-sm border border-gray-800 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-800">
            {table.header.map((h, hi) => (
              <th key={hi} className="px-4 py-3 text-left font-medium text-gray-300">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {table.rows.map((row, ri) => (
            <tr key={ri} className="bg-gray-900/50">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3 text-gray-400">{renderInline(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ));
}
