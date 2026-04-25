import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';
import {
  Bot,
  TrendingUp,
  Wallet,
  Activity,
  Plus,
  FlaskConical,
  ChevronRight,
  Loader2,
} from 'lucide-react';

const STATUS_STYLES = {
  running: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  stopped: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  error: 'bg-red-500/10 text-red-400 border-red-500/30',
};

function StatCard({ label, value, icon: Icon, trend }) {
  const isPositive = typeof trend === 'number' ? trend >= 0 : true;
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400">{label}</span>
        <div className="rounded-lg bg-gray-800 p-2">
          <Icon className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      <p className={`text-2xl font-bold ${isPositive ? 'text-white' : 'text-red-400'}`}>
        {value}
      </p>
      {trend !== undefined && (
        <p className={`text-xs mt-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}
          {trend}%
        </p>
      )}
    </div>
  );
}

function BotCard({ bot }) {
  const status = bot.status || 'stopped';
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white truncate">{bot.name}</h3>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status] || STATUS_STYLES.stopped}`}
        >
          {status === 'running' && (
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          )}
          {status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
        <div>
          <span className="block text-gray-500">Symbol</span>
          {bot.symbol}
        </div>
        <div>
          <span className="block text-gray-500">Timeframe</span>
          {bot.timeframe}
        </div>
        <div>
          <span className="block text-gray-500">P&amp;L</span>
          <span className={bot.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}>
            {bot.pnl >= 0 ? '+' : ''}
            ${Number(bot.pnl || 0).toFixed(2)}
          </span>
        </div>
        <div>
          <span className="block text-gray-500">Trades</span>
          {bot.total_trades ?? 0}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dashRes, botsRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/bots'),
        ]);
        setStats(dashRes.data);
        setBots(Array.isArray(botsRes.data) ? botsRes.data : botsRes.data.bots || []);
      } catch {
        // Silently handle -- user sees empty state
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const activeBots = stats?.active_bots ?? bots.filter((b) => b.status === 'running').length;
  const totalBots = stats?.total_bots ?? bots.length;
  const brokerAccounts = stats?.broker_accounts ?? 0;
  const totalPnl = stats?.total_pnl ?? 0;
  const winRate = stats?.win_rate_pct ?? 0;

  const recentBots = bots.slice(0, 6);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Overview of your trading bots</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Active Bots" value={activeBots} icon={Activity} />
          <StatCard label="Total Bots" value={totalBots} icon={Bot} />
          <StatCard label="Broker Accounts" value={brokerAccounts} icon={Wallet} />
          <StatCard
            label="Total P&L"
            value={`${totalPnl >= 0 ? '+' : ''}$${Number(totalPnl).toFixed(2)}`}
            icon={TrendingUp}
            trend={totalPnl >= 0 ? Math.abs(totalPnl) > 0 ? undefined : undefined : undefined}
          />
          <StatCard
            label="Win Rate"
            value={`${Number(winRate).toFixed(1)}%`}
            icon={TrendingUp}
          />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/bots')}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create Bot
          </button>
          <button
            onClick={() => navigate('/backtest')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm font-semibold text-gray-300 hover:bg-gray-700 transition cursor-pointer"
          >
            <FlaskConical className="h-4 w-4" />
            Run Backtest
          </button>
        </div>

        {/* Recent Bots */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Bots</h2>
            <button
              onClick={() => navigate('/bots')}
              className="inline-flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {recentBots.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
              <Bot className="h-10 w-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No bots yet. Create your first trading bot to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentBots.map((bot) => (
                <BotCard key={bot.id} bot={bot} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
