import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  X,
  Loader2,
  Server,
  ShieldCheck,
  ShieldAlert,
  Unplug,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConnect, setShowConnect] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [connectStatus, setConnectStatus] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [form, setForm] = useState({
    label: '',
    mt5_login: '',
    mt5_password: '',
    mt5_server: '',
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      const { data } = await api.get('/accounts');
      setAccounts(data);
    } catch {
      toast.error('Failed to load accounts');
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }

  function validateForm() {
    if (!form.label.trim()) return 'Label is required';
    if (!form.mt5_login.trim()) return 'MT5 Login is required';
    if (!/^\d+$/.test(form.mt5_login.trim())) return 'MT5 Login must be a number (e.g. 12345678)';
    if (!form.mt5_password || form.mt5_password.length < 4) return 'MT5 Password must be at least 4 characters';
    if (!form.mt5_server.trim()) return 'MT5 Server is required';
    return null;
  }

  async function handleConnect(e) {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setSubmitting(true);
    setConnectStatus('Connecting to broker...');

    // Progress simulation — the real steps happen server-side
    const steps = [
      { delay: 3000, msg: 'Deploying MT5 cloud terminal...' },
      { delay: 8000, msg: 'Connecting to broker server...' },
      { delay: 15000, msg: 'Verifying login credentials...' },
    ];
    const timers = steps.map((s) => setTimeout(() => setConnectStatus(s.msg), s.delay));

    try {
      await api.post('/accounts', {
        label: form.label.trim(),
        mt5_login: form.mt5_login.trim(),
        mt5_password: form.mt5_password,
        mt5_server: form.mt5_server,
      });
      toast.success('Account connected and verified!');
      setShowConnect(false);
      setForm({ label: '', mt5_login: '', mt5_password: '', mt5_server: 'Exness-MT5Real' });
      await fetchAccounts();
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        toast.error(detail.map((d) => d.msg || d).join('. '));
      } else {
        toast.error(detail || 'Failed to connect account. Please check your details and try again.');
      }
    } finally {
      timers.forEach(clearTimeout);
      setSubmitting(false);
      setConnectStatus('');
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await api.delete(`/accounts/${id}`);
      toast.success('Account removed');
      setAccounts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      toast.error(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          'Failed to delete account'
      );
    } finally {
      setDeletingId(null);
    }
  }

  function statusBadge(status) {
    const s = (status || '').toLowerCase();
    if (s === 'connected' || s === 'active' || s === 'online') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
          <ShieldCheck className="h-3 w-3" />
          Connected
        </span>
      );
    }
    if (s === 'error' || s === 'failed' || s === 'disconnected') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400">
          <ShieldAlert className="h-3 w-3" />
          {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-500/10 px-2.5 py-0.5 text-xs font-medium text-gray-400">
        <Unplug className="h-3 w-3" />
        {status || 'Unknown'}
      </span>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Broker Accounts</h1>
          <button
            onClick={() => setShowConnect(true)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
          >
            <Plus className="h-4 w-4" />
            Connect Account
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        )}

        {/* Empty state */}
        {!loading && accounts.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-800 bg-gray-900 py-20">
            <Server className="mb-4 h-12 w-12 text-gray-600" />
            <p className="mb-1 text-gray-400">No accounts connected yet.</p>
            <p className="text-sm text-gray-600">
              Connect your MT5 broker account to start live trading.
            </p>
          </div>
        )}

        {/* Accounts list */}
        {!loading && accounts.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="relative rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-gray-700"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {account.label || 'Unnamed Account'}
                    </h3>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Login: {account.mt5_login}
                    </p>
                  </div>
                  {statusBadge(account.status)}
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Server</span>
                    <span className="font-mono text-gray-300">
                      {account.mt5_server || '--'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">MT5 Login</span>
                    <span className="font-mono text-gray-300">
                      {account.mt5_login}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(account.id)}
                  disabled={deletingId === account.id}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950/60 disabled:opacity-50"
                >
                  {deletingId === account.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Remove Account
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connect Account Modal */}
      {showConnect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">
                Connect Broker Account
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowGuide(true)}
                  className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-800 hover:text-emerald-400"
                  title="How to get your MT5 credentials"
                >
                  <HelpCircle className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowConnect(false)}
                  className="text-gray-400 transition hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleConnect} className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">Label</label>
                <input type="text" required value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="e.g. My Gold Trading Account" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">MT5 Login</label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" required value={form.mt5_login}
                  onChange={(e) => setForm({ ...form, mt5_login: e.target.value.replace(/\D/g, '') })}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="12345678" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">MT5 Password</label>
                <input type="password" required value={form.mt5_password}
                  onChange={(e) => setForm({ ...form, mt5_password: e.target.value })}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="Your MT5 trading password" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">MT5 Server</label>
                <input type="text" value={form.mt5_server}
                  onChange={(e) => setForm({ ...form, mt5_server: e.target.value })}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="e.g. Exness-MT5Trial14"
                  list="mt5-servers"
                  required
                />
                <datalist id="mt5-servers">
                  <option value="Exness-MT5Real" />
                  <option value="Exness-MT5Real2" />
                  <option value="Exness-MT5Real3" />
                  <option value="Exness-MT5Real4" />
                  <option value="Exness-MT5Real5" />
                  <option value="Exness-MT5Real6" />
                  <option value="Exness-MT5Real7" />
                  <option value="Exness-MT5Real8" />
                  <option value="Exness-MT5Real9" />
                  <option value="Exness-MT5Real10" />
                  <option value="Exness-MT5Real11" />
                  <option value="Exness-MT5Real12" />
                  <option value="Exness-MT5Real13" />
                  <option value="Exness-MT5Real14" />
                  <option value="Exness-MT5Real15" />
                  <option value="Exness-MT5Trial" />
                  <option value="Exness-MT5Trial2" />
                  <option value="Exness-MT5Trial3" />
                  <option value="Exness-MT5Trial4" />
                  <option value="Exness-MT5Trial5" />
                  <option value="Exness-MT5Trial6" />
                  <option value="Exness-MT5Trial7" />
                  <option value="Exness-MT5Trial8" />
                  <option value="Exness-MT5Trial9" />
                  <option value="Exness-MT5Trial10" />
                  <option value="Exness-MT5Trial11" />
                  <option value="Exness-MT5Trial12" />
                  <option value="Exness-MT5Trial13" />
                  <option value="Exness-MT5Trial14" />
                  <option value="Exness-MT5Trial15" />
                </datalist>
              </div>

              <div className="rounded-lg border border-gray-800 bg-gray-800/40 p-2.5">
                <p className="flex items-center gap-1.5 text-xs text-gray-500">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  Your password is used for one-time account verification via an encrypted connection and is never stored.
                </p>
              </div>

              {submitting && connectStatus && (
                <div className="rounded-lg border border-emerald-900/30 bg-emerald-950/20 p-3">
                  <p className="flex items-center gap-2 text-sm text-emerald-300">
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    {connectStatus}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">This may take up to 60 seconds while we verify your credentials with the broker.</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-1">
                <button type="button" onClick={() => !submitting && setShowConnect(false)} disabled={submitting}
                  className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-gray-600 hover:text-white disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50">
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {submitting ? 'Verifying...' : 'Connect & Verify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Setup Guide Popup */}
      {showGuide && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4" onClick={() => setShowGuide(false)}>
          <div className="w-full max-w-lg rounded-xl border border-gray-700 bg-gray-900 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <HelpCircle className="h-5 w-5 text-emerald-400" />
                How to Get Your MT5 Credentials
              </h2>
              <button onClick={() => setShowGuide(false)} className="text-gray-400 transition hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-5 overflow-y-auto p-6">
              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">1</div>
                <div>
                  <p className="text-sm font-medium text-gray-200">Create an Exness Account</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Go to{' '}
                    <a href="https://one.exnessonelink.com/a/aeabmertu4" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-emerald-400 hover:underline">
                      Sign up on Exness <ExternalLink className="h-3 w-3" />
                    </a>
                    {' '}and create a free account. Complete the verification process.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">2</div>
                <div>
                  <p className="text-sm font-medium text-gray-200">Open an MT5 Trading Account</p>
                  <p className="mt-1 text-sm text-gray-400">
                    In your Exness Personal Area, go to <span className="font-medium text-gray-300">My Accounts</span> and click <span className="font-medium text-gray-300">"Open New Account"</span>. Choose <span className="font-medium text-gray-300">MetaTrader 5</span> as the platform. You can pick either a Real or Demo account.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">3</div>
                <div>
                  <p className="text-sm font-medium text-gray-200">Find Your MT5 Login</p>
                  <p className="mt-1 text-sm text-gray-400">
                    After creating the account, you'll see a <span className="font-medium text-gray-300">Login Number</span> (e.g. <code className="rounded bg-gray-800 px-1.5 py-0.5 text-sm text-emerald-300">12345678</code>). This is your <span className="font-medium text-gray-300">MT5 Login</span>. You can always find it under My Accounts.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">4</div>
                <div>
                  <p className="text-sm font-medium text-gray-200">Get Your MT5 Password</p>
                  <p className="mt-1 text-sm text-gray-400">
                    The trading password was set when you created the MT5 account. If you forgot it, click the <span className="font-medium text-gray-300">gear icon</span> next to your account and select <span className="font-medium text-gray-300">"Change Trading Password"</span>.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">5</div>
                <div>
                  <p className="text-sm font-medium text-gray-200">Find Your Server Name</p>
                  <p className="mt-1 text-sm text-gray-400">
                    The server name is shown on your account details, e.g. <code className="rounded bg-gray-800 px-1.5 py-0.5 text-sm text-emerald-300">Exness-MT5Real</code> for real accounts or <code className="rounded bg-gray-800 px-1.5 py-0.5 text-sm text-emerald-300">Exness-MT5Trial</code> for demo. You can also find it in the MT5 app under <span className="font-medium text-gray-300">File &rarr; Login to Trade Account</span>.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-emerald-900/30 bg-emerald-950/20 p-3">
                <p className="flex items-start gap-2 text-sm text-emerald-300">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <span className="font-medium">Your password is safe.</span> It is used once to verify your account via an encrypted connection. We never store your MT5 password in our database.
                  </span>
                </p>
              </div>

              <button onClick={() => setShowGuide(false)}
                className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500">
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
