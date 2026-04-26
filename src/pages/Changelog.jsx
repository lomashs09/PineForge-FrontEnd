import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { buildBreadcrumbLd } from '../components/seoLd';
import changelog from '../data/changelog';

export default function Changelog() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Seo
        title="Changelog — What's New on PineForge"
        description="A running record of every meaningful change shipped on PineForge — features, fixes, and platform improvements."
        path="/changelog"
        structuredData={buildBreadcrumbLd([
          { name: 'Home', url: '/' },
          { name: 'Changelog', url: '/changelog' },
        ])}
      />
      <Navbar />

      <section className="relative overflow-hidden pt-32 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            <span className="text-emerald-400">Changelog</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Every meaningful change shipped on PineForge — most recent first.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        {changelog.map((entry) => (
          <article key={entry.date} className="border-l border-gray-800 pl-6 mt-12 first:mt-0 relative">
            <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-emerald-500" />
            <div className="flex items-baseline gap-3">
              <time className="text-sm text-gray-500">
                {new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
              <span className="rounded-full bg-emerald-950/40 px-2 py-0.5 text-xs font-medium text-emerald-300">
                {entry.version}
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-white">{entry.headline}</h2>
            <p className="mt-3 text-gray-300 leading-relaxed">{entry.summary}</p>
            <ul className="mt-4 space-y-1.5 text-sm text-gray-400">
              {entry.items.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </article>
        ))}
      </div>

      <Footer />
    </div>
  );
}
