import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Flame,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/strategies', label: 'Strategies' },
  { to: '/tools', label: 'Tools' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/blog', label: 'Blog' },
];

const authLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/bots', label: 'My Bots' },
  { to: '/library', label: 'My Library' },
  { to: '/backtest', label: 'Backtest' },
];

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const links = user ? authLinks : publicLinks;

  function handleLogout() {
    onLogout?.();
    setDropdownOpen(false);
    navigate('/');
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-white">
          <Flame className="h-7 w-7 text-emerald-400" />
          <span className="text-xl font-bold tracking-tight">PineForge</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to + link.label}
              to={link.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop right side */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                  {(user.full_name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <span>{user.full_name || user.email}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-lg border border-gray-700 bg-gray-900 shadow-xl">
                    <div className="border-b border-gray-700 px-4 py-3">
                      <p className="text-sm font-medium text-white">
                        {user.full_name || 'User'}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-gray-800 hover:text-white md:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-800 bg-gray-950/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-4 py-4">
            {links.map((link) => (
              <Link
                key={link.to + link.label}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
              >
                {link.label}
              </Link>
            ))}

            <div className="my-3 border-t border-gray-800" />

            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                    {(user.full_name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {user.full_name || 'User'}
                    </p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-center text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-emerald-600 px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
