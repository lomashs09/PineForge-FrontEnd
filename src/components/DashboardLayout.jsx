import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  FileCode,
  FlaskConical,
  Wallet,
  Receipt,
  Flame,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const sidebarItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/bots', label: 'My Bots', icon: Bot },
  { to: '/library', label: 'My Library', icon: FileCode },
  { to: '/backtest', label: 'Backtest', icon: FlaskConical },
  { to: '/accounts', label: 'Accounts', icon: Wallet },
  { to: '/billing', label: 'Billing', icon: Receipt },
];

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [limits, setLimits] = useState(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    api.get('/auth/limits').then(({ data }) => setLimits(data)).catch(() => {});
  }, [location.pathname]);

  function handleLogout() {
    logout();
    navigate('/');
  }

  function isActive(path) {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-gray-800 px-5">
        <Link to="/" className="flex items-center gap-2 text-white">
          <Flame className="h-6 w-6 text-emerald-400" />
          <span className="text-lg font-bold tracking-tight">PineForge</span>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-emerald-600/15 text-emerald-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? 'text-emerald-400' : ''}`} />
              {item.label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section at bottom */}
      <div className="border-t border-gray-800 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
            {(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {user?.full_name || 'User'}
            </p>
            <p className="truncate text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-gray-800 bg-gray-900 md:block">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-50 h-full w-64 bg-gray-900 shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-800 bg-gray-950 px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden text-sm text-gray-400 md:block">
            Welcome back,{' '}
            <span className="font-medium text-white">
              {user?.full_name || user?.email || 'Trader'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 md:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                {(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white md:flex md:items-center md:gap-2"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Free plan banner */}
          {limits && !limits.is_admin && !bannerDismissed && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-900/30 bg-amber-950/20 px-4 py-3">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-300">Free Plan</p>
                <p className="mt-0.5 text-xs text-amber-400/70">
                  Usage-based pricing — you only pay when bots are running.
                  {' '}
                  <Link to="/billing" className="font-medium text-amber-300 underline underline-offset-2 hover:text-amber-200">
                    View usage
                  </Link>
                  {' | '}
                  <Link to="/pricing" className="font-medium text-amber-300 underline underline-offset-2 hover:text-amber-200">
                    See rates
                  </Link>
                </p>
              </div>
              <button
                onClick={() => setBannerDismissed(true)}
                className="shrink-0 rounded p-1 text-amber-400/50 hover:text-amber-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
