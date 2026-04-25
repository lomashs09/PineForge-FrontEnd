import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import {
  Users,
  Bot,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  DollarSign,
  Activity,
  Shield,
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [usersRes, botsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/bots'),
      ]);
      setUsers(usersRes.data);
      setBots(botsRes.data);
    } catch {
      // Not admin or error
    } finally {
      setLoading(false);
    }
  }

  if (user && !user.is_admin) {
    return <Navigate to="/dashboard" />;
  }

  const totalUsers = users.length;
  const totalBots = bots.length;
  const runningBots = bots.filter(b => b.status === 'running').length;
  const errorBots = bots.filter(b => b.status === 'error').length;
  const totalBalance = users.reduce((s, u) => s + (u.balance || 0), 0);
  const totalPnl = users.reduce((s, u) => s + (u.total_pnl || 0), 0);

  const tabCls = (t) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition cursor-pointer ${
      tab === t ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'
    }`;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-5 w-5 text-amber-400" />
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        </div>
        <p className="text-sm text-gray-400">Platform overview and user management</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <StatCard icon={Users} label="Users" value={totalUsers} color="blue" />
            <StatCard icon={Bot} label="Total Bots" value={totalBots} color="violet" />
            <StatCard icon={Activity} label="Running" value={runningBots} color="emerald" />
            <StatCard icon={AlertCircle} label="Errors" value={errorBots} color="red" />
            <StatCard icon={DollarSign} label="Total Balance" value={`$${totalBalance.toFixed(2)}`} color="amber" />
            <StatCard icon={DollarSign} label="Total PnL" value={`$${totalPnl.toFixed(2)}`} color={totalPnl >= 0 ? 'emerald' : 'red'} />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6">
            <button onClick={() => setTab('users')} className={tabCls('users')}>Users ({users.length})</button>
            <button onClick={() => setTab('bots')} className={tabCls('bots')}>All Bots ({bots.length})</button>
          </div>

          {/* Users tab */}
          {tab === 'users' && (
            <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
                      <th className="px-4 py-3 text-left">User</th>
                      <th className="px-4 py-3 text-left">Plan</th>
                      <th className="px-4 py-3 text-right">Balance</th>
                      <th className="px-4 py-3 text-right">PnL</th>
                      <th className="px-4 py-3 text-center">Bots</th>
                      <th className="px-4 py-3 text-center">Accounts</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-left">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-800/50 transition">
                        <td className="px-4 py-3">
                          <div className="font-medium text-white">{u.full_name}</div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            u.is_admin ? 'bg-amber-500/10 text-amber-400' : 'bg-gray-700 text-gray-300'
                          }`}>
                            {u.is_admin ? 'Admin' : u.plan}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-white">${(u.balance || 0).toFixed(2)}</td>
                        <td className={`px-4 py-3 text-right font-medium ${(u.total_pnl || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          ${(u.total_pnl || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {u.bots_running > 0 && <span className="text-xs text-emerald-400">{u.bots_running} running</span>}
                            {u.bots_error > 0 && <span className="text-xs text-red-400">{u.bots_error} error</span>}
                            {u.bots_stopped > 0 && <span className="text-xs text-gray-500">{u.bots_stopped} stopped</span>}
                            {u.bot_count === 0 && <span className="text-xs text-gray-600">0</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-gray-300">{u.account_count}</td>
                        <td className="px-4 py-3 text-center">
                          {u.is_email_verified ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400 mx-auto" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-600 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bots tab */}
          {tab === 'bots' && (
            <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
                      <th className="px-4 py-3 text-left">Bot</th>
                      <th className="px-4 py-3 text-left">User</th>
                      <th className="px-4 py-3 text-left">Symbol</th>
                      <th className="px-4 py-3 text-center">TF</th>
                      <th className="px-4 py-3 text-center">Live</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-left">Error</th>
                      <th className="px-4 py-3 text-left">Started</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {bots.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-800/50 transition">
                        <td className="px-4 py-3 font-medium text-white">{b.name}</td>
                        <td className="px-4 py-3 text-xs text-gray-400">{b.user_email}</td>
                        <td className="px-4 py-3 text-gray-300">{b.symbol}</td>
                        <td className="px-4 py-3 text-center text-gray-400">{b.timeframe}</td>
                        <td className="px-4 py-3 text-center">
                          {b.is_live ? (
                            <span className="text-xs text-emerald-400">LIVE</span>
                          ) : (
                            <span className="text-xs text-gray-500">DRY</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                            b.status === 'running' ? 'bg-emerald-500/10 text-emerald-400'
                            : b.status === 'error' ? 'bg-red-500/10 text-red-400'
                            : b.status === 'starting' ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-gray-700 text-gray-400'
                          }`}>
                            {b.status === 'running' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-red-400 max-w-[200px] truncate" title={b.error_message || ''}>
                          {b.error_message || '--'}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {b.started_at ? new Date(b.started_at).toLocaleString() : '--'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: 'text-blue-400',
    violet: 'text-violet-400',
    emerald: 'text-emerald-400',
    red: 'text-red-400',
    amber: 'text-amber-400',
  };
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 ${colors[color]}`} />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}
