import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Play,
  Loader2,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  BarChart3,
  Info,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';

export default function Backtest() {
  const [searchParams] = useSearchParams();
  const [scripts, setScripts] = useState([]);
  const [config, setConfig] = useState(null);
  const [scriptId, setScriptId] = useState(searchParams.get('script') || '');
  const [symbol, setSymbol] = useState('XAUUSD');
  const [interval, setInterval] = useState('1d');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [capital, setCapital] = useState(1000);
  const [quantity, setQuantity] = useState('');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Fetch config and scripts on mount
  useEffect(() => {
    Promise.all([
      api.get('/scripts/backtest/config'),
      api.get('/scripts'),
    ]).then(([configRes, scriptsRes]) => {
      setConfig(configRes.data);
      setScripts(scriptsRes.data);
      if (!scriptId && scriptsRes.data.length > 0) {
        setScriptId(String(scriptsRes.data[0].id));
      }
      // Set initial dates based on config
      const today = configRes.data.today;
      setEnd(today);
      const maxDays = configRes.data.intervals.find(i => i.value === '1d')?.max_days || 365;
      const startDate = daysAgo(maxDays, today);
      setStart(startDate);
    }).catch(() => {});
  }, []);

  // When interval changes, adjust start date to fit within allowed range
  useEffect(() => {
    if (!config) return;
    const selected = config.intervals.find(i => i.value === interval);
    if (!selected) return;
    const earliest = daysAgo(selected.max_days, config.today);
    if (start < earliest) {
      setStart(earliest);
    }
    if (end > config.today) {
      setEnd(config.today);
    }
  }, [interval, config]);

  // Compute min/max dates for the selected interval
  const selectedInterval = config?.intervals.find(i => i.value === interval);
  const minDate = selectedInterval ? daysAgo(selectedInterval.max_days, config.today) : '';
  const maxDate = config?.today || '';

  const symbols = config?.symbols || [];
  const intervals = config?.intervals || [];

  async function runBacktest(e) {
    e.preventDefault();
    if (!scriptId) return;
    setRunning(true);
    setError(null);
    setResults(null);
    try {
      const payload = { symbol, interval, start, end, capital: Number(capital) };
      if (quantity) payload.quantity = Number(quantity);
      const { data } = await api.post(`/scripts/${scriptId}/backtest`, payload);
      setResults(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Backtest failed. Please check your parameters and try again.'
      );
    } finally {
      setRunning(false);
    }
  }

  const equityData = buildEquityCurve(results, capital);
  const sortedTrades = results?.trades
    ? [...results.trades].sort((a, b) => new Date(a.entry_date || 0) - new Date(b.entry_date || 0))
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Backtesting Engine</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Config panel */}
          <form onSubmit={runBacktest} className="space-y-5 rounded-xl border border-gray-800 bg-gray-900 p-6 lg:col-span-1">
            {/* Script */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">Strategy Script</label>
              <select value={scriptId} onChange={(e) => setScriptId(e.target.value)} required
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 outline-none focus:border-emerald-500">
                <option value="">Select a script...</option>
                {scripts.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Symbol */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">Symbol</label>
              <select value={symbol} onChange={(e) => setSymbol(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 outline-none focus:border-emerald-500">
                {symbols.map((s) => (
                  <option key={s.symbol} value={s.symbol}>{s.symbol} - {s.name}</option>
                ))}
              </select>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {symbols.slice(0, 6).map((s) => (
                  <button key={s.symbol} type="button" onClick={() => setSymbol(s.symbol)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                      symbol === s.symbol ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'
                    }`}>
                    {s.symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* Interval */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">Interval</label>
              <select value={interval} onChange={(e) => setInterval(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 outline-none focus:border-emerald-500">
                {intervals.map((i) => (
                  <option key={i.value} value={i.value}>{i.label} (max {i.max_days} days)</option>
                ))}
              </select>
              {selectedInterval && (
                <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <Info className="h-3 w-3" />
                  Data available for the last {selectedInterval.max_days} days
                </p>
              )}
            </div>

            {/* Date range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">Start Date</label>
                <input type="date" value={start} min={minDate} max={end || maxDate}
                  onChange={(e) => setStart(e.target.value)} required
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">End Date</label>
                <input type="date" value={end} min={start || minDate} max={maxDate}
                  onChange={(e) => setEnd(e.target.value)} required
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 outline-none focus:border-emerald-500" />
              </div>
            </div>

            {/* Capital & Quantity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">Capital ($)</label>
                <input type="number" value={capital} onChange={(e) => setCapital(e.target.value)} min={1} required
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">Quantity</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min={1} step={1}
                  placeholder="Auto (min 1)"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 outline-none focus:border-emerald-500" />
                <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <Info className="h-3 w-3" />
                  Leave empty to use script default
                </p>
              </div>
            </div>

            {/* Run */}
            <button type="submit" disabled={running || !scriptId}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50">
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {running ? 'Running Backtest...' : 'Run Backtest'}
            </button>
          </form>

          {/* Results panel */}
          <div className="lg:col-span-2">
            {running && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-gray-800 bg-gray-900 py-24">
                <Loader2 className="mb-4 h-10 w-10 animate-spin text-emerald-500" />
                <p className="text-gray-400">Running backtest...</p>
              </div>
            )}

            {error && !running && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-red-900/50 bg-red-950/30 py-16">
                <AlertCircle className="mb-4 h-10 w-10 text-red-400" />
                <p className="mb-1 font-medium text-red-300">Backtest Failed</p>
                <p className="max-w-md text-center text-sm text-red-400/80">{error}</p>
              </div>
            )}

            {!running && !error && !results && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-gray-800 bg-gray-900 py-24">
                <BarChart3 className="mb-4 h-10 w-10 text-gray-600" />
                <p className="text-gray-500">Configure parameters and run a backtest to see results.</p>
              </div>
            )}

            {results && !running && (
              <div className="space-y-6">
                {/* Strategy name */}
                <div className="rounded-xl border border-gray-800 bg-gray-900 px-5 py-3">
                  <span className="text-sm text-gray-400">Strategy: </span>
                  <span className="font-semibold text-white">{results.strategy_name}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  <StatCard label="Total Return" value={fmtPct(results.total_return_pct)} positive={(results.total_return_pct ?? 0) >= 0} />
                  <StatCard label="Net Profit" value={fmtMoney(results.net_profit)} positive={(results.net_profit ?? 0) >= 0} />
                  <StatCard label="Total Trades" value={results.total_trades} neutral />
                  <StatCard label="Win Rate" value={fmtPct(results.win_rate_pct)} positive={(results.win_rate_pct ?? 0) >= 50} />
                  <StatCard label="Profit Factor" value={fmtNum(results.profit_factor)} positive={(results.profit_factor ?? 0) >= 1} />
                  <StatCard label="Sharpe Ratio" value={fmtNum(results.sharpe_ratio)} positive={(results.sharpe_ratio ?? 0) >= 0} />
                  <StatCard label="Max Drawdown" value={fmtPct(results.max_drawdown_pct)} positive={false} />
                </div>

                {/* Equity curve */}
                {equityData.length > 1 && (
                  <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                    <h3 className="mb-4 text-sm font-medium text-gray-400">Equity Curve</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={equityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                        <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.5rem', color: '#e5e7eb', fontSize: 13 }}
                          formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Equity']} />
                        <Line type="monotone" dataKey="equity" stroke="#10b981" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Trades table */}
                {sortedTrades.length > 0 && (
                  <div className="rounded-xl border border-gray-800 bg-gray-900">
                    <div className="border-b border-gray-800 px-5 py-4">
                      <h3 className="text-sm font-medium text-gray-400">Trade Log ({sortedTrades.length} trades)</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
                            <th className="px-5 py-3">Direction</th>
                            <th className="px-5 py-3">Entry Price</th>
                            <th className="px-5 py-3">Exit Price</th>
                            <th className="px-5 py-3">P&L</th>
                            <th className="px-5 py-3">Entry Date</th>
                            <th className="px-5 py-3">Exit Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedTrades.map((trade, idx) => {
                            const pnl = trade.pnl ?? 0;
                            const isLong = trade.direction === 'long';
                            return (
                              <tr key={idx} className="border-b border-gray-800/50 transition hover:bg-gray-800/40">
                                <td className="px-5 py-3">
                                  <span className={`inline-flex items-center gap-1 text-xs font-semibold ${isLong ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {isLong ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                                    {isLong ? 'Long' : 'Short'}
                                  </span>
                                </td>
                                <td className="px-5 py-3 text-gray-300">{fmtPrice(trade.entry_price)}</td>
                                <td className="px-5 py-3 text-gray-300">{fmtPrice(trade.exit_price)}</td>
                                <td className={`px-5 py-3 font-medium ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {pnl >= 0 ? '+' : ''}{fmtMoney(pnl)}
                                </td>
                                <td className="px-5 py-3 text-gray-500">{fmtDate(trade.entry_date)}</td>
                                <td className="px-5 py-3 text-gray-500">{fmtDate(trade.exit_date)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ---------- Helpers ---------- */

function daysAgo(days, fromDate) {
  const d = fromDate ? new Date(fromDate) : new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

function StatCard({ label, value, positive, neutral }) {
  let color = 'text-gray-200';
  if (!neutral) color = positive ? 'text-emerald-400' : 'text-red-400';
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
      <p className="mb-1 text-xs text-gray-500">{label}</p>
      <div className="flex items-center gap-2">
        {!neutral && <Icon className={`h-4 w-4 ${color}`} />}
        <span className={`text-lg font-bold ${color}`}>{value ?? '--'}</span>
      </div>
    </div>
  );
}

function buildEquityCurve(results, startCapital) {
  if (!results?.trades?.length) return [];
  let equity = Number(startCapital) || 10000;
  const curve = [{ date: 'Start', equity }];
  const sorted = [...results.trades].sort((a, b) => new Date(a.exit_date || 0) - new Date(b.exit_date || 0));
  for (const t of sorted) {
    equity += Number(t.pnl ?? 0);
    curve.push({ date: fmtDate(t.exit_date), equity: Math.round(equity * 100) / 100 });
  }
  return curve;
}

function fmtPct(val) { return val == null ? '--' : `${Number(val).toFixed(2)}%`; }
function fmtMoney(val) { return val == null ? '--' : `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }
function fmtNum(val) { return val == null ? '--' : Number(val).toFixed(2); }
function fmtPrice(val) { return val == null ? '--' : Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 }); }
function fmtDate(val) {
  if (!val) return '--';
  try { return new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch { return String(val); }
}
