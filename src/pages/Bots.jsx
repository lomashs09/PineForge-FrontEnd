import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Plus,
  Play,
  Square,
  Trash2,
  FileText,
  X,
  Bot,
  Loader2,
  AlertCircle,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

// Fetched from API in CreateBotModal — these are fallbacks
const DEFAULT_SYMBOLS = ['XAUUSDm', 'EURUSDm', 'GBPUSDm', 'USDJPYm', 'BTCUSDm'];
const TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', '1d'];

const STATUS_BADGE = {
  running: {
    dot: 'bg-emerald-400 animate-pulse',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    label: 'Running',
  },
  stopped: {
    dot: 'bg-gray-500',
    text: 'text-gray-400',
    bg: 'bg-gray-500/10 border-gray-500/30',
    label: 'Stopped',
  },
  error: {
    dot: 'bg-red-500',
    text: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/30',
    label: 'Error',
  },
  start_requested: {
    dot: 'bg-amber-400 animate-pulse',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30',
    label: 'Starting...',
  },
  starting: {
    dot: 'bg-amber-400 animate-pulse',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30',
    label: 'Starting...',
  },
  stop_requested: {
    dot: 'bg-yellow-400 animate-pulse',
    text: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/30',
    label: 'Stopping...',
  },
  stopping: {
    dot: 'bg-yellow-400 animate-pulse',
    text: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/30',
    label: 'Stopping...',
  },
};

/* ------------------------------------------------------------------ */
/*  Small reusable pieces                                              */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }) {
  const s = STATUS_BADGE[status] || STATUS_BADGE.stopped;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label || status}
    </span>
  );
}

function ModalBackdrop({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Create Bot Modal                                                   */
/* ------------------------------------------------------------------ */

function CreateBotModal({ onClose, onCreated }) {
  const [accounts, setAccounts] = useState([]);
  const [scripts, setScripts] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [loadingDeps, setLoadingDeps] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    broker_account_id: '',
    script_id: '',
    symbol: '',
    timeframe: TIMEFRAMES[3],
    lot_size: '0.01',
    is_live: false,
  });

  useEffect(() => {
    async function load() {
      try {
        const [accRes, scrRes, cfgRes] = await Promise.all([
          api.get('/accounts'),
          api.get('/scripts'),
          api.get('/scripts/backtest/config'),
        ]);
        const accs = Array.isArray(accRes.data) ? accRes.data : accRes.data.accounts || [];
        const scrs = Array.isArray(scrRes.data) ? scrRes.data : scrRes.data.scripts || [];
        const syms = cfgRes.data?.symbols || [];
        setAccounts(accs);
        setScripts(scrs);
        setSymbols(syms);
        if (accs.length) setForm((f) => ({ ...f, broker_account_id: String(accs[0].id) }));
        if (scrs.length) setForm((f) => ({ ...f, script_id: String(scrs[0].id) }));
        if (syms.length) setForm((f) => ({ ...f, symbol: syms[0].mt5 || syms[0].symbol }));
      } catch {
        toast.error('Failed to load accounts or scripts');
      } finally {
        setLoadingDeps(false);
      }
    }
    load();
  }, []);

  function set(key) {
    return (e) => {
      const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setForm((f) => ({ ...f, [key]: val }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Bot name is required'); return; }
    if (!form.broker_account_id) { toast.error('Please select a broker account. Connect one first in the Accounts page.'); return; }
    if (!form.script_id) { toast.error('Please select a strategy script'); return; }
    if (!form.lot_size || parseFloat(form.lot_size) <= 0) { toast.error('Lot size must be greater than 0'); return; }
    if (parseFloat(form.lot_size) > 1) { toast.error('Lot size cannot exceed 1'); return; }
    setSubmitting(true);
    try {
      await api.post('/bots', {
        name: form.name.trim(),
        broker_account_id: form.broker_account_id,
        script_id: form.script_id,
        symbol: form.symbol,
        timeframe: form.timeframe,
        lot_size: parseFloat(form.lot_size),
        is_live: form.is_live,
      });
      toast.success('Bot created');
      onCreated();
      onClose();
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = Array.isArray(detail)
        ? detail.map((d) => d.msg || d).join('. ')
        : detail || 'Failed to create bot';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls =
    'w-full rounded-lg border border-gray-700 bg-gray-800 py-2 px-3 text-sm text-white placeholder-gray-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition';
  const labelCls = 'block text-sm font-medium text-gray-300 mb-1.5';

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Create Bot</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loadingDeps ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className={labelCls}>Name</label>
              <input
                required
                value={form.name}
                onChange={set('name')}
                placeholder="My Gold Scalper"
                className={inputCls}
              />
            </div>

            {/* Broker Account */}
            <div>
              <label className={labelCls}>Broker Account</label>
              {accounts.length === 0 ? (
                <div className="rounded-lg border border-yellow-900/30 bg-yellow-950/20 p-3">
                  <p className="text-xs text-yellow-300">No broker accounts found. <a href="/accounts" className="underline hover:text-yellow-200">Connect one first</a>.</p>
                </div>
              ) : (
                <select value={form.broker_account_id} onChange={set('broker_account_id')} required className={inputCls}>
                  <option value="">Select an account...</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label} &mdash; {a.mt5_login} ({a.mt5_server})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Script */}
            <div>
              <label className={labelCls}>Script</label>
              {scripts.length === 0 ? (
                <p className="text-xs text-gray-500">No scripts found. Upload one first.</p>
              ) : (
                <select value={form.script_id} onChange={set('script_id')} required className={inputCls}>
                  <option value="">Select a strategy...</option>
                  {scripts.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name || s.filename}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Symbol + Timeframe */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Symbol</label>
                <select value={form.symbol} onChange={set('symbol')} className={inputCls}>
                  {symbols.length > 0 ? symbols.map((s) => (
                    <option key={s.mt5 || s.symbol} value={s.mt5 || s.symbol}>
                      {s.symbol} — {s.name}
                    </option>
                  )) : DEFAULT_SYMBOLS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Timeframe</label>
                <select value={form.timeframe} onChange={set('timeframe')} className={inputCls}>
                  {TIMEFRAMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lot Size */}
            <div>
              <label className={labelCls}>Lot Size</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="1"
                required
                value={form.lot_size}
                onChange={set('lot_size')}
                className={inputCls}
              />
              <p className="mt-1 text-xs text-gray-500">Max 1.0 lot per trade.</p>
            </div>

            {/* Live toggle */}
            <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">Live Trading</p>
                <p className="text-xs text-gray-500">
                  {form.is_live ? 'Real money will be used' : 'Running in dry-run mode'}
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={form.is_live}
                  onChange={set('is_live')}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-gray-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-emerald-600 peer-checked:after:translate-x-full" />
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || accounts.length === 0 || scripts.length === 0}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {submitting ? 'Creating...' : 'Create Bot'}
            </button>
          </form>
        )}
      </div>
    </ModalBackdrop>
  );
}

/* ------------------------------------------------------------------ */
/*  Logs & Trades Modal                                                */
/* ------------------------------------------------------------------ */

function LogsModal({ bot, onClose }) {
  const [tab, setTab] = useState('positions');
  const [logs, setLogs] = useState([]);
  const [trades, setTrades] = useState(null); // null = not fetched yet
  const [positions, setPositions] = useState([]);
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tradesLoading, setTradesLoading] = useState(false);

  // Fetch positions, account info, and logs on open
  useEffect(() => {
    async function fetchData() {
      try {
        const promises = [api.get(`/bots/${bot.id}/logs?limit=100`)];
        if (bot.status === 'running') {
          promises.push(api.get(`/bots/${bot.id}/positions`));
          promises.push(api.get(`/bots/${bot.id}/account-info`));
        }
        const results = await Promise.all(promises);
        setLogs(Array.isArray(results[0].data) ? results[0].data : results[0].data.logs || []);
        if (results[1]) setPositions(Array.isArray(results[1].data) ? results[1].data : []);
        if (results[2]) setAccountInfo(results[2].data);
      } catch {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [bot.id, bot.status]);

  // Fetch trade history only when Trades tab is clicked
  useEffect(() => {
    if (tab !== 'trades' || trades !== null) return;
    setTradesLoading(true);
    api.get(`/bots/${bot.id}/history`)
      .then(({ data }) => setTrades(Array.isArray(data) ? data : []))
      .catch(() => { toast.error('Failed to load trade history'); setTrades([]); })
      .finally(() => setTradesLoading(false));
  }, [tab, trades, bot.id]);

  const tabCls = (t) =>
    `px-3 py-2 text-sm font-medium rounded-lg transition cursor-pointer ${
      tab === t ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'
    }`;

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl p-6 shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">{bot.name}</h2>
            <p className="text-xs text-gray-400">{bot.symbol} &middot; {bot.timeframe} &middot; {bot.is_live ? 'LIVE' : 'DRY RUN'}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Account info bar */}
        {accountInfo && (
          <div className="mb-4 grid grid-cols-5 gap-3">
            {[
              { label: 'Balance', value: accountInfo.balance, currency: accountInfo.currency },
              { label: 'Equity', value: accountInfo.equity, currency: accountInfo.currency },
              { label: 'Margin', value: accountInfo.margin, currency: accountInfo.currency },
              { label: 'Free Margin', value: accountInfo.freeMargin, currency: accountInfo.currency },
              { label: 'Margin Level', value: accountInfo.marginLevel, suffix: '%' },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-sm font-semibold text-white">
                  {item.suffix ? `${Number(item.value || 0).toFixed(1)}${item.suffix}` : `${item.currency || '$'} ${Number(item.value || 0).toFixed(2)}`}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-4">
          <button onClick={() => setTab('positions')} className={tabCls('positions')}>
            Positions {positions.length > 0 && <span className="ml-1 text-xs opacity-60">({positions.length})</span>}
          </button>
          <button onClick={() => setTab('trades')} className={tabCls('trades')}>
            Trades {trades && trades.length > 0 && <span className="ml-1 text-xs opacity-60">({trades.length})</span>}
          </button>
          <button onClick={() => setTab('logs')} className={tabCls('logs')}>
            Logs {logs.length > 0 && <span className="ml-1 text-xs opacity-60">({logs.length})</span>}
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
          </div>
        )}

        {/* Positions tab */}
        {!loading && tab === 'positions' && (
          <div className="flex-1 overflow-y-auto">
            {positions.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                {bot.status === 'running' ? 'No open positions for this symbol.' : 'Bot is not running. Start the bot to see positions.'}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
                    <th className="px-3 py-2 text-left">ID</th>
                    <th className="px-3 py-2 text-left">Type</th>
                    <th className="px-3 py-2 text-left">Symbol</th>
                    <th className="px-3 py-2 text-right">Volume</th>
                    <th className="px-3 py-2 text-right">Open Price</th>
                    <th className="px-3 py-2 text-right">Current Price</th>
                    <th className="px-3 py-2 text-right">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((p, i) => (
                    <tr key={p.id || i} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                      <td className="px-3 py-2 text-gray-500 font-mono text-xs">{p.id || '--'}</td>
                      <td className={`px-3 py-2 font-medium ${p.type?.includes('BUY') ? 'text-emerald-400' : 'text-red-400'}`}>
                        {p.type?.includes('BUY') ? 'BUY' : 'SELL'}
                      </td>
                      <td className="px-3 py-2 text-gray-300">{p.symbol}</td>
                      <td className="px-3 py-2 text-right text-gray-300">{p.volume}</td>
                      <td className="px-3 py-2 text-right text-gray-300">{Number(p.openPrice || 0).toFixed(2)}</td>
                      <td className="px-3 py-2 text-right text-gray-300">{Number(p.currentPrice || 0).toFixed(2)}</td>
                      <td className={`px-3 py-2 text-right font-medium ${(p.profit || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {p.profit != null ? `${p.profit >= 0 ? '+' : ''}$${Number(p.profit).toFixed(2)}` : '--'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Trades tab — real history from broker (lazy loaded) */}
        {!loading && tab === 'trades' && (
          <div className="flex-1 overflow-y-auto">
            {tradesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
              </div>
            ) : (trades || []).length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                No trades recorded yet. Trades appear here once the bot executes orders.
              </div>
            ) : (
              <>
                {/* Summary */}
                <div className="mb-3 flex gap-4 text-xs text-gray-400">
                  <span>{trades.length} trade{trades.length !== 1 ? 's' : ''}</span>
                  <span>Total P&L: <span className={`font-medium ${trades.reduce((s, t) => s + (t.profit || 0), 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    ${trades.reduce((s, t) => s + (t.profit || 0), 0).toFixed(2)}
                  </span></span>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
                      <th className="px-2 py-2 text-left">Time</th>
                      <th className="px-2 py-2 text-left">Type</th>
                      <th className="px-2 py-2 text-left">Symbol</th>
                      <th className="px-2 py-2 text-right">Volume</th>
                      <th className="px-2 py-2 text-right">Entry</th>
                      <th className="px-2 py-2 text-right">Close</th>
                      <th className="px-2 py-2 text-right">Commission</th>
                      <th className="px-2 py-2 text-right">Swap</th>
                      <th className="px-2 py-2 text-right">P&L</th>
                      <th className="px-2 py-2 text-right">Order</th>
                      <th className="px-2 py-2 text-right">Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map((t, i) => (
                      <tr key={t.dealId || i} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                        <td className="px-2 py-2 text-gray-400 text-xs">
                          {t.time ? new Date(t.time).toLocaleString() : '--'}
                        </td>
                        <td className={`px-2 py-2 font-medium ${t.type === 'buy' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {t.type === 'buy' ? 'BUY' : 'SELL'}
                        </td>
                        <td className="px-2 py-2 text-gray-300">{t.symbol}</td>
                        <td className="px-2 py-2 text-right text-gray-300">{t.volume || '--'}</td>
                        <td className="px-2 py-2 text-right text-gray-300">{t.entryPrice ? Number(t.entryPrice).toFixed(3) : '--'}</td>
                        <td className="px-2 py-2 text-right text-gray-300">{t.closePrice ? Number(t.closePrice).toFixed(3) : '--'}</td>
                        <td className="px-2 py-2 text-right text-gray-500">{Number(t.commission || 0).toFixed(2)}</td>
                        <td className="px-2 py-2 text-right text-gray-500">{Number(t.swap || 0).toFixed(2)}</td>
                        <td className={`px-2 py-2 text-right font-medium ${
                          (t.profit || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {t.profit != null ? `${t.profit >= 0 ? '+' : ''}$${Number(t.profit).toFixed(2)}` : '--'}
                        </td>
                        <td className="px-2 py-2 text-right text-gray-600 font-mono text-xs">{t.orderId || '--'}</td>
                        <td className="px-2 py-2 text-right text-gray-600 font-mono text-xs">{t.positionId || '--'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}

        {/* Logs tab */}
        {!loading && tab === 'logs' && (
          <div className="flex-1 overflow-y-auto rounded-lg bg-gray-950 border border-gray-800 p-4 font-mono text-xs text-gray-300 space-y-1">
            {logs.length === 0 && (
              <p className="text-gray-500 text-center py-8">No logs available</p>
            )}
            {logs.map((log, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-gray-600 shrink-0">
                  {log.created_at
                    ? new Date(log.created_at).toLocaleTimeString()
                    : log.timestamp
                      ? new Date(log.timestamp).toLocaleTimeString()
                      : String(i + 1).padStart(3, '0')}
                </span>
                <span
                  className={
                    log.level === 'error' ? 'text-red-400'
                    : log.level === 'trade' ? 'text-emerald-400'
                    : log.level === 'signal' ? 'text-yellow-400'
                    : 'text-gray-300'
                  }
                >
                  {log.message || (typeof log === 'string' ? log : JSON.stringify(log))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ModalBackdrop>
  );
}

/* ------------------------------------------------------------------ */
/*  Delete Confirmation Modal                                          */
/* ------------------------------------------------------------------ */

function DeleteModal({ bot, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`/bots/${bot.id}`);
      toast.success(`"${bot.name}" deleted`);
      onConfirm();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to delete bot';
      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-red-500/10 p-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Delete Bot</h2>
        </div>
        <p className="text-sm text-gray-400 mb-6">
          Are you sure you want to delete <span className="text-white font-medium">{bot.name}</span>?
          This action cannot be undone.
        </p>
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50 transition cursor-pointer"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

/* ------------------------------------------------------------------ */
/*  Stop Bot Confirmation Modal                                        */
/* ------------------------------------------------------------------ */

function StopBotModal({ bot, onClose, onConfirm }) {
  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-amber-500/10 p-2">
            <AlertCircle className="h-5 w-5 text-amber-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Stop Bot</h2>
        </div>
        <p className="text-sm text-gray-400 mb-2">
          Are you sure you want to stop <span className="text-white font-medium">{bot.name}</span>?
        </p>
        <div className="rounded-lg border border-amber-900/30 bg-amber-950/20 px-4 py-3 mb-6">
          <p className="text-xs font-medium text-amber-300">All open positions will be closed</p>
          <p className="text-xs text-amber-400/70 mt-1">
            Stopping a live bot will immediately close all open {bot.symbol} positions on your broker account at current market prices.
          </p>
        </div>
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500 transition cursor-pointer"
          >
            Stop & Close Positions
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Bots Page                                                     */
/* ------------------------------------------------------------------ */

export default function Bots() {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [logsBot, setLogsBot] = useState(null);
  const [deleteBot, setDeleteBot] = useState(null);
  const [stopBot, setStopBot] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [balance, setBalance] = useState(null);

  const fetchBots = useCallback(async () => {
    try {
      const [botsRes, limitsRes] = await Promise.all([
        api.get('/bots'),
        api.get('/auth/limits'),
      ]);
      setBots(Array.isArray(botsRes.data) ? botsRes.data : botsRes.data.bots || []);
      setBalance(limitsRes.data?.balance ?? 0);
    } catch {
      toast.error('Failed to load bots');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBots();
    // Auto-refresh every 10s to pick up status changes
    const interval = setInterval(fetchBots, 10000);
    return () => clearInterval(interval);
  }, [fetchBots]);

  async function toggleBot(bot) {
    const action = bot.status === 'running' ? 'stop' : 'start';

    // Show confirmation for stopping live bots
    if (action === 'stop' && bot.is_live) {
      setStopBot(bot);
      return;
    }

    await executeToggle(bot, action);
  }

  async function executeToggle(bot, action) {
    setTogglingId(bot.id);
    setStopBot(null);
    try {
      const { data } = await api.post(`/bots/${bot.id}/${action}`);

      if (action === 'stop' && data.positions_closed > 0) {
        toast.success(`Bot stopped. ${data.positions_closed} position(s) closed (P&L: $${data.close_pnl?.toFixed(2) || '0.00'})`);
      } else {
        toast.success(`Bot ${action === 'start' ? 'starting...' : 'stopped'}`);
      }

      // Poll until status transitions from "starting"/"stopping" to a final state
      const targetTransient = action === 'start' ? 'starting' : 'stopping';
      for (let i = 0; i < 15; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        try {
          const { data } = await api.get(`/bots/${bot.id}`);
          // Update this bot in the list immediately
          setBots((prev) => prev.map((b) => (b.id === bot.id ? data : b)));
          if (data.status !== targetTransient) break;
        } catch { break; }
      }
      await fetchBots();
    } catch (err) {
      const msg = err.response?.data?.detail || `Failed to ${action} bot`;
      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">My Bots</h1>
            <p className="text-sm text-gray-400 mt-1">Manage your trading bots</p>
          </div>
          <div className="flex items-center gap-3">
            {balance !== null && (
              <span className={`text-sm font-medium ${balance >= 5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                Balance: ${balance.toFixed(2)}
              </span>
            )}
            <button
              onClick={() => setShowCreate(true)}
              disabled={balance !== null && balance < 5}
              title={balance !== null && balance < 5 ? 'Minimum $5.00 balance required. Add funds in Billing.' : ''}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Create Bot
            </button>
          </div>
        </div>

        {/* Low balance warning */}
        {balance !== null && balance < 5 && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-900/30 bg-amber-950/20 px-4 py-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="text-sm font-medium text-amber-300">Insufficient Balance</p>
              <p className="mt-0.5 text-xs text-amber-400/70">
                Minimum $5.00 required to create bots. Your balance is ${balance.toFixed(2)}.
                {' '}
                <a href="/billing" className="font-medium text-amber-300 underline underline-offset-2 hover:text-amber-200">
                  Add funds
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Stopped/Error bots warning */}
        {!loading && bots.some(b => b.status === 'error' || (b.status === 'stopped' && b.error_message)) && (
          <div className="flex items-start gap-3 rounded-xl border border-red-900/30 bg-red-950/20 px-4 py-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-300">Bot Issues Detected</p>
              <div className="mt-1 space-y-1">
                {bots.filter(b => b.error_message).map(b => (
                  <p key={b.id} className="text-xs text-red-400/70">
                    <span className="font-medium text-red-300">{b.name}</span>: {b.error_message}
                  </p>
                ))}
              </div>
              <p className="mt-2 text-xs text-red-400/70">
                If your broker account ran out of margin, deposit funds into your Exness account and restart the bot.
              </p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && bots.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-16 text-center">
            <Bot className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-1">No bots yet</h3>
            <p className="text-sm text-gray-400 mb-4">Create your first bot to start trading</p>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Create Bot
            </button>
          </div>
        )}

        {/* Bots Table */}
        {!loading && bots.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-left">
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Name
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Symbol
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Timeframe
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      P&amp;L
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {bots.map((bot) => {
                    const pnl = Number(bot.pnl || 0);
                    return (
                      <tr key={bot.id} className="hover:bg-gray-800/50 transition">
                        <td className="px-5 py-4">
                          <div className="font-medium text-white">{bot.name}</div>
                          <div className="flex items-center gap-2">
                            {bot.script_name && (
                              <span className="text-xs text-violet-400">{bot.script_name}</span>
                            )}
                            {bot.is_live === false && (
                              <span className="text-xs text-gray-500">Dry run</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-300">{bot.symbol}</td>
                        <td className="px-5 py-4 text-gray-300">{bot.timeframe}</td>
                        <td className="px-5 py-4">
                          <StatusBadge status={bot.status || 'stopped'} />
                          {bot.error_message && (
                            <p className="mt-1 text-xs text-red-400/70 max-w-[200px] truncate" title={bot.error_message}>
                              {bot.error_message}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`font-medium ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                          >
                            {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Start / Stop */}
                            <button
                              onClick={() => toggleBot(bot)}
                              disabled={togglingId === bot.id}
                              title={bot.status === 'running' ? 'Stop' : 'Start'}
                              className={`rounded-lg p-2 transition cursor-pointer ${
                                bot.status === 'running'
                                  ? 'text-yellow-400 hover:bg-yellow-500/10'
                                  : 'text-emerald-400 hover:bg-emerald-500/10'
                              } disabled:opacity-50`}
                            >
                              {togglingId === bot.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : bot.status === 'running' ? (
                                <Square className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </button>

                            {/* Logs */}
                            <button
                              onClick={() => setLogsBot(bot)}
                              title="View Logs"
                              className="rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-white transition cursor-pointer"
                            >
                              <FileText className="h-4 w-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => setDeleteBot(bot)}
                              title="Delete"
                              className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateBotModal onClose={() => setShowCreate(false)} onCreated={fetchBots} />
      )}
      {logsBot && <LogsModal bot={logsBot} onClose={() => setLogsBot(null)} />}
      {deleteBot && (
        <DeleteModal
          bot={deleteBot}
          onClose={() => setDeleteBot(null)}
          onConfirm={fetchBots}
        />
      )}
      {stopBot && (
        <StopBotModal
          bot={stopBot}
          onClose={() => setStopBot(null)}
          onConfirm={() => executeToggle(stopBot, 'stop')}
        />
      )}
    </DashboardLayout>
  );
}
