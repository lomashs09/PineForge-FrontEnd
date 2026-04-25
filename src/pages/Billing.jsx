import { useState, useEffect } from 'react';
import {
  Receipt,
  Activity,
  Server,
  Zap,
  CircleDollarSign,
  TrendingUp,
  AlertCircle,
  Plus,
  Wallet,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';

const RATES = {
  activeBotPerHour: 0.022,
  inactiveAccountPerHour: 0.002,
  deploymentFee: 0.13,
  accountSetup: 3.0,
};

const FUND_AMOUNTS_INR = [100, 500, 1000, 2500];
const FUND_AMOUNTS_USD = [5, 10, 25, 50];

export default function Billing() {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [fundingAmount, setFundingAmount] = useState(null);
  const [fundingLoading, setFundingLoading] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [showPayPal, setShowPayPal] = useState(false);
  const [fxRate, setFxRate] = useState(null); // INR -> USD rate

  useEffect(() => {
    fetchUsage();
    fetchFxRate();
    const params = new URLSearchParams(window.location.search);
    if (params.get('funded') === '1') {
      toast.success('Funds added successfully! Balance will update shortly.');
      window.history.replaceState({}, '', '/billing');
    }
  }, []);

  async function fetchFxRate() {
    try {
      const { data } = await api.get('/payments/fx-rate');
      setFxRate(data);
    } catch (err) {
      console.error('Failed to fetch FX rate:', err);
    }
  }

  async function fetchUsage() {
    try {
      const { data } = await api.get('/billing/usage');
      setUsage(data);
    } catch (err) {
      console.error('Failed to fetch usage:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddFunds(amount) {
    if (amount < 1) {
      toast.error(`Minimum top-up is ${currency === 'INR' ? '₹' : '$'}1`);
      return;
    }
    setFundingLoading(true);

    if (currency === 'USD') {
      await handlePayPal(amount);
    } else {
      await handleStripe(amount);
    }
  }

  async function handleStripe(amount) {
    try {
      const { data } = await api.post('/payments/add-funds', { amount, currency: 'INR' });
      window.location.href = data.checkout_url;
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to start payment');
      setFundingLoading(false);
    }
  }

  async function handleRazorpay(amount) {
    try {
      const { data } = await api.post('/payments/razorpay/create-order', { amount, currency });

      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const rzpOptions = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: 'PineForge',
        description: 'Add Funds to Wallet',
        order_id: data.order_id,
        prefill: { email: data.user_email, name: data.user_name },
        theme: { color: '#059669' },
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/payments/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: amount,
              currency: 'INR',
            });
            const credited = verifyRes.data?.credited_usd || 0;
            toast.success(`₹${amount} paid → $${credited.toFixed(2)} added to your balance!`);
            fetchUsage();
          } catch (err) {
            toast.error('Payment verification failed. Contact support if money was deducted.');
          }
          setFundingLoading(false);
          setShowAddFunds(false);
        },
        modal: { ondismiss: () => setFundingLoading(false) },
      };
      new window.Razorpay(rzpOptions).open();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to start payment');
      setFundingLoading(false);
    }
  }

  async function handlePayPal(amount) {
    try {
      // Create order on backend
      const { data: orderData } = await api.post('/payments/paypal/create-order', { amount });

      // Load PayPal SDK
      if (!window.paypal) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = `https://www.paypal.com/sdk/js?client-id=${orderData.client_id}&currency=USD&intent=capture`;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Render PayPal button into a modal-like container
      const container = document.getElementById('paypal-button-container');
      if (container) container.innerHTML = '';

      window.paypal.Buttons({
        createOrder: () => orderData.order_id,
        onApprove: async (data) => {
          try {
            await api.post('/payments/paypal/capture', {
              order_id: data.orderID,
              amount: amount,
            });
            toast.success(`$${amount} added to your balance!`);
            fetchUsage();
          } catch (err) {
            toast.error('Payment capture failed. Contact support.');
          }
          setFundingLoading(false);
          setShowAddFunds(false);
          setShowPayPal(false);
        },
        onCancel: () => {
          setFundingLoading(false);
          setShowPayPal(false);
        },
        onError: (err) => {
          console.error('PayPal error:', err);
          toast.error('PayPal payment failed');
          setFundingLoading(false);
          setShowPayPal(false);
        },
      }).render('#paypal-button-container');

      setShowPayPal(true);
      setFundingLoading(false);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to start PayPal payment');
      setFundingLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Billing & Usage</h1>
        <p className="mt-1 text-sm text-gray-400">Monitor your usage and manage your balance.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      ) : usage ? (
        <>
          {/* Balance card */}
          <div className="mb-8 rounded-2xl border border-emerald-800/30 bg-gradient-to-br from-emerald-950/30 to-gray-900 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm font-medium text-gray-400">Account Balance</span>
                </div>
                <p className="mt-2 text-4xl font-extrabold text-white">
                  ${(usage.balance || 0).toFixed(2)}
                </p>
                {usage.balance < 5 && (
                  <p className="mt-1 text-xs text-amber-400">
                    Minimum $5.00 required to create and run bots
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowAddFunds(!showAddFunds)}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Funds
              </button>
            </div>

            {showAddFunds && (
              <div className="mt-6 border-t border-emerald-800/30 pt-6">
                {/* Currency toggle */}
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-sm text-gray-400">Currency:</span>
                  <div className="inline-flex rounded-lg border border-gray-700 bg-gray-800 p-0.5">
                    <button
                      onClick={() => { setCurrency('INR'); setFundingAmount(null); setCustomAmount(''); }}
                      className={`rounded-md px-3 py-1 text-xs font-medium transition ${currency === 'INR' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      ₹ INR
                    </button>
                    <button
                      onClick={() => { setCurrency('USD'); setFundingAmount(null); setCustomAmount(''); }}
                      className={`rounded-md px-3 py-1 text-xs font-medium transition ${currency === 'USD' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      $ USD
                    </button>
                  </div>
                </div>

                <p className="mb-3 text-sm font-medium text-gray-300">Select amount to add</p>
                <div className="flex flex-wrap gap-3">
                  {(currency === 'INR' ? FUND_AMOUNTS_INR : FUND_AMOUNTS_USD).map((amt) => (
                    <button
                      key={amt}
                      onClick={() => { setFundingAmount(amt); setCustomAmount(''); }}
                      disabled={fundingLoading}
                      className={`rounded-lg border px-5 py-2.5 text-sm font-semibold transition cursor-pointer ${
                        fundingAmount === amt
                          ? 'border-emerald-500 bg-emerald-600/20 text-emerald-300'
                          : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      {currency === 'INR' ? '₹' : '$'}{amt}
                    </button>
                  ))}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">or</span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">{currency === 'INR' ? '₹' : '$'}</span>
                      <input
                        type="number"
                        min="10"
                        max="1000"
                        step="1"
                        placeholder="Custom"
                        value={customAmount}
                        onChange={(e) => { setCustomAmount(e.target.value); setFundingAmount(null); }}
                        className="w-28 rounded-lg border border-gray-700 bg-gray-800 py-2.5 pl-7 pr-3 text-sm text-white placeholder-gray-500 outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
                {/* Conversion display */}
                {currency === 'INR' && fxRate && (fundingAmount || customAmount) && (
                  <div className="mt-4 rounded-lg border border-blue-900/30 bg-blue-950/20 px-4 py-3">
                    <p className="text-sm text-blue-300">
                      You will receive{' '}
                      <span className="font-bold text-white">
                        ${((fundingAmount || parseFloat(customAmount) || 0) * fxRate.inr_to_usd).toFixed(2)}
                      </span>
                      {' '}in your wallet
                    </p>
                    <p className="mt-0.5 text-xs text-blue-400/70">
                      Conversion rate: 1 USD = ₹{fxRate.usd_to_inr} (live FX rate). Wallet balance is in USD.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => handleAddFunds(fundingAmount || parseFloat(customAmount) || 0)}
                  disabled={fundingLoading || (!fundingAmount && !customAmount)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  {fundingLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CircleDollarSign className="h-4 w-4" />
                  )}
                  {fundingLoading ? 'Redirecting to payment...' : `Pay ${currency === 'INR' ? '₹' : '$'}${(fundingAmount || parseFloat(customAmount) || 0).toFixed(currency === 'USD' ? 2 : 0)}`}
                </button>

                {/* PayPal button container — shown after PayPal order is created */}
                <div id="paypal-button-container" className={`mt-4 ${showPayPal ? 'block' : 'hidden'}`}></div>

                <p className="mt-2 text-xs text-gray-500">
                  {currency === 'INR'
                    ? 'Secure payment via Stripe. UPI, cards, netbanking & wallets accepted.'
                    : 'Secure payment via PayPal. Cards (Visa, Mastercard, Amex) and PayPal balance accepted.'
                  } All funds are non-refundable.
                </p>
              </div>
            )}
          </div>

          {/* Current period summary */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard icon={Activity} label="Active Bot Hours" value={`${usage.active_bot_hours.toFixed(1)}h`} cost={usage.active_bot_cost} color="violet" />
            <SummaryCard icon={Server} label="Account Hosting Hours" value={`${usage.inactive_account_hours.toFixed(1)}h`} cost={usage.inactive_account_cost} color="blue" />
            <SummaryCard icon={Zap} label="Deployments" value={usage.deployments} cost={usage.deployment_cost} color="amber" />
            <SummaryCard icon={TrendingUp} label="Current Period Total" value="" cost={usage.total_cost} color="emerald" highlight />
          </div>

          {/* Rate card */}
          <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Your Rates</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <RateItem label="Active Bot" rate="$0.022/hr" estimate="~$15.84/mo 24/7" />
              <RateItem label="Account Hosting" rate="$0.002/hr" estimate="~$1.44/mo" />
              <RateItem label="Bot Deployment" rate="$0.13" estimate="per start (min 1hr)" />
              <RateItem label="Account Setup" rate="$3.00" estimate="one-time" />
            </div>
          </div>

          {/* Active resources */}
          <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Active Resources</h2>
            {usage.active_bots && usage.active_bots.length > 0 ? (
              <div className="space-y-3">
                {usage.active_bots.map((bot) => (
                  <div key={bot.id} className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <div>
                        <p className="text-sm font-medium text-white">{bot.name}</p>
                        <p className="text-xs text-gray-500">{bot.symbol} {bot.timeframe}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-200">{bot.hours_running.toFixed(1)}h</p>
                      <p className="text-xs text-gray-500">${(bot.hours_running * RATES.activeBotPerHour).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No bots currently running.</p>
            )}

            {usage.active_accounts && usage.active_accounts.length > 0 && (
              <div className="mt-4 space-y-3">
                <h3 className="text-sm font-medium text-gray-400">Connected Accounts</h3>
                {usage.active_accounts.map((acc) => (
                  <div key={acc.id} className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Server className="h-4 w-4 text-blue-400" />
                      <div>
                        <p className="text-sm font-medium text-white">{acc.label}</p>
                        <p className="text-xs text-gray-500">{acc.mt5_login}@{acc.mt5_server}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-200">{acc.hours_connected.toFixed(1)}h</p>
                      <p className="text-xs text-gray-500">${(acc.hours_connected * RATES.inactiveAccountPerHour).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Invoice history */}
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Invoice History</h2>
            {usage.invoices && usage.invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="pb-3 text-left font-medium text-gray-400">Period</th>
                      <th className="pb-3 text-left font-medium text-gray-400">Bot Hours</th>
                      <th className="pb-3 text-left font-medium text-gray-400">Deployments</th>
                      <th className="pb-3 text-right font-medium text-gray-400">Amount</th>
                      <th className="pb-3 text-right font-medium text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {usage.invoices.map((inv, i) => (
                      <tr key={i}>
                        <td className="py-3 text-gray-200">{inv.period}</td>
                        <td className="py-3 text-gray-400">{inv.bot_hours.toFixed(1)}h</td>
                        <td className="py-3 text-gray-400">{inv.deployments}</td>
                        <td className="py-3 text-right font-medium text-white">${inv.amount.toFixed(2)}</td>
                        <td className="py-3 text-right">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            inv.status === 'paid' ? 'bg-emerald-950 text-emerald-400'
                            : inv.status === 'pending' ? 'bg-amber-950 text-amber-400'
                            : 'bg-gray-800 text-gray-400'
                          }`}>{inv.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center py-8 text-center">
                <Receipt className="mb-3 h-10 w-10 text-gray-700" />
                <p className="text-sm text-gray-500">No invoices yet. Usage will appear here at the end of each billing period.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center py-20 text-center">
          <AlertCircle className="mb-3 h-10 w-10 text-gray-700" />
          <p className="text-sm text-gray-500">Failed to load billing data. Please try again.</p>
          <button onClick={fetchUsage} className="mt-4 rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Retry</button>
        </div>
      )}
    </DashboardLayout>
  );
}

function SummaryCard({ icon: Icon, label, value, cost, color, highlight }) {
  const colors = {
    violet: 'border-violet-800/30 bg-violet-950/10',
    blue: 'border-blue-800/30 bg-blue-950/10',
    amber: 'border-amber-800/30 bg-amber-950/10',
    emerald: 'border-emerald-800/30 bg-emerald-950/10',
  };
  const iconColors = { violet: 'text-violet-400', blue: 'text-blue-400', amber: 'text-amber-400', emerald: 'text-emerald-400' };

  return (
    <div className={`rounded-xl border p-5 ${highlight ? colors[color] : 'border-gray-800 bg-gray-900'}`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${iconColors[color]}`} />
        <span className="text-xs font-medium text-gray-400">{label}</span>
      </div>
      {value && <p className="mt-2 text-2xl font-bold text-white">{value}</p>}
      <p className={`${value ? 'mt-0.5' : 'mt-2'} ${highlight ? 'text-2xl font-bold text-emerald-400' : 'text-lg font-semibold text-white'}`}>
        ${cost.toFixed(2)}
      </p>
    </div>
  );
}

function RateItem({ label, rate, estimate }) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-950 px-4 py-3">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{rate}</p>
      <p className="text-xs text-gray-500">{estimate}</p>
    </div>
  );
}
