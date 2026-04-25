import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';

const footerLinks = [
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/docs', label: 'Documentation' },
  { to: '/support', label: 'Support' },
  { to: '/terms', label: 'Terms' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/cancellation', label: 'Refund Policy' },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Brand */}
          <div className="flex items-center gap-2 text-white">
            <Flame className="h-5 w-5 text-emerald-400" />
            <span className="text-lg font-bold tracking-tight">PineForge</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-800 pt-6 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} PineForge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
