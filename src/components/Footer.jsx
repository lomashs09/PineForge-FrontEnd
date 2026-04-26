import { Link } from 'react-router-dom';
import { Flame, Mail } from 'lucide-react';
import NewsletterSignup from './NewsletterSignup';

// lucide-react dropped brand logos in v1.7+ — inline the GitHub mark.
function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.11.79-.25.79-.56v-2.18c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18a10.93 10.93 0 0 1 5.74 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.05.78 2.13v3.16c0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

const sections = [
  {
    title: 'Product',
    links: [
      { to: '/strategies', label: 'Strategy Library' },
      { to: '/symbols', label: 'Markets' },
      { to: '/tools', label: 'Free Tools' },
      { to: '/pricing', label: 'Pricing' },
      { to: '/compare', label: 'Compare' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { to: '/blog', label: 'Blog' },
      { to: '/docs', label: 'Documentation' },
      { to: '/glossary', label: 'Glossary' },
      { to: '/changelog', label: 'Changelog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/press', label: 'Press Kit' },
      { to: '/support', label: 'Support' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/terms', label: 'Terms' },
      { to: '/privacy', label: 'Privacy' },
      { to: '/cancellation', label: 'Refunds' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        {/* Newsletter capture above link grid */}
        <div className="mb-12 border-b border-gray-800 pb-12">
          <NewsletterSignup />
        </div>

        <div className="grid gap-10 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white">
              <Flame className="h-6 w-6 text-emerald-400" />
              <span className="text-xl font-bold tracking-tight">PineForge</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-gray-400 leading-relaxed">
              Build, backtest, and deploy automated trading bots with Pine Script. Pay only for what you run.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://github.com/lomashs09/PineForge"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="rounded-md border border-gray-800 bg-gray-900 p-2 text-gray-400 transition hover:border-gray-700 hover:text-white"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <a
                href="mailto:support@getpineforge.com"
                aria-label="Email support"
                className="rounded-md border border-gray-800 bg-gray-900 p-2 text-gray-400 transition hover:border-gray-700 hover:text-white"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Sections */}
          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-4">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-300">
                  {section.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {section.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-sm text-gray-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-gray-800 pt-6 sm:flex-row">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} PineForge. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Trading involves risk. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </footer>
  );
}
