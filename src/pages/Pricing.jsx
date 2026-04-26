import { Link } from 'react-router-dom';
import {
  Check,
  Zap,
  Bot,
  BarChart3,
  Wallet,
  Clock,
  FileCode,
  Headphones,
  ArrowRight,
  DollarSign,
  Activity,
  Server,
  CircleDollarSign,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import PricingCalculator from '../components/PricingCalculator';
import { buildBreadcrumbLd, buildFaqLd, SITE_URL, SITE_NAME } from '../components/seoLd';

const PRICING_LD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: `${SITE_NAME} — Automated Trading Platform`,
  description: 'Pay-as-you-go pricing for automated trading bots on MetaTrader 5.',
  brand: { '@type': 'Brand', name: SITE_NAME },
  offers: [
    { '@type': 'Offer', name: 'Active Bot', price: '0.022', priceCurrency: 'USD', priceSpecification: { '@type': 'UnitPriceSpecification', price: '0.022', priceCurrency: 'USD', unitText: 'HOUR' }, url: `${SITE_URL}/pricing` },
    { '@type': 'Offer', name: 'Trading Account Setup', price: '3.00', priceCurrency: 'USD', url: `${SITE_URL}/pricing` },
    { '@type': 'Offer', name: 'Bot Deployment', price: '0.13', priceCurrency: 'USD', url: `${SITE_URL}/pricing` },
    { '@type': 'Offer', name: 'Account Hosting', price: '0.002', priceCurrency: 'USD', priceSpecification: { '@type': 'UnitPriceSpecification', price: '0.002', priceCurrency: 'USD', unitText: 'HOUR' }, url: `${SITE_URL}/pricing` },
  ],
};

const pricingItems = [
  {
    icon: CircleDollarSign,
    label: 'Trading Account Setup',
    price: '$3.00',
    unit: 'per account',
    description: 'One-time fee when you connect a new MT5 broker account.',
  },
  {
    icon: Activity,
    label: 'Active Bot',
    price: '$0.022',
    unit: 'per hour',
    description: 'Charged only while your bot is running. ~$15.84/month if running 24/7.',
  },
  {
    icon: Server,
    label: 'Inactive Account Hosting',
    price: '$0.002',
    unit: 'per hour',
    description: 'Keep your account connected when no bots are running. ~$1.44/month.',
  },
  {
    icon: Zap,
    label: 'Bot Deployment',
    price: '$0.13',
    unit: 'per start',
    description: 'Small fee each time you start or restart a bot.',
  },
];

const freeFeatures = [
  'Unlimited backtesting',
  '28 built-in strategies',
  'Custom strategy upload',
  'All timeframes (1m to 1d)',
  'Trade analytics & logs',
  'Community support',
];

const examples = [
  {
    label: 'Casual Trader',
    description: '1 account, 1 bot running 12h/day',
    breakdown: [
      { item: 'Account setup (one-time)', cost: 3.00 },
      { item: 'Bot runtime (12h x 30 days)', cost: 0.022 * 12 * 30 },
      { item: 'Inactive hosting (12h x 30 days)', cost: 0.002 * 12 * 30 },
      { item: 'Deployments (~4/month)', cost: 0.13 * 4 },
    ],
  },
  {
    label: 'Active Trader',
    description: '2 accounts, 3 bots running 24/7',
    breakdown: [
      { item: 'Account setup (one-time)', cost: 3.00 * 2 },
      { item: '3 bots x 24h x 30 days', cost: 0.022 * 24 * 30 * 3 },
      { item: 'Deployments (~10/month)', cost: 0.13 * 10 },
    ],
  },
  {
    label: 'Professional',
    description: '5 accounts, 10 bots running 24/7',
    breakdown: [
      { item: 'Account setup (one-time)', cost: 3.00 * 5 },
      { item: '10 bots x 24h x 30 days', cost: 0.022 * 24 * 30 * 10 },
      { item: 'Deployments (~20/month)', cost: 0.13 * 20 },
    ],
  },
];

const faqs = [
  {
    q: 'How does usage-based pricing work?',
    a: 'You only pay for what you use. Bots are billed per hour while running, and accounts have a small hourly hosting fee. Stop a bot anytime and the charges stop immediately.',
  },
  {
    q: 'Is backtesting free?',
    a: 'Yes! Backtesting, strategy uploads, and all analysis tools are completely free with no limits.',
  },
  {
    q: 'When am I charged?',
    a: 'Usage is tracked in real-time and billed monthly. You can monitor your current usage anytime in the Billing section of your dashboard.',
  },
  {
    q: 'Which brokers do you support?',
    a: 'PineForge connects to Exness MT5 accounts via MetaAPI. This gives you access to forex pairs (EUR/USD, GBP/USD), commodities (Gold, Silver, Oil), indices, and more.',
  },
  {
    q: 'Do I need to know Pine Script?',
    a: 'No! We provide 28 pre-built strategies ready to use. If you want to create custom strategies, Pine Script v5 knowledge helps — and there are thousands of free scripts on TradingView you can adapt.',
  },
  {
    q: 'Is my broker account secure?',
    a: 'Yes. Your MT5 credentials are encrypted at rest and transmitted securely via MetaAPI, a SOC 2 compliant service. We never store plain-text passwords.',
  },
  {
    q: 'What if I only run bots during market hours?',
    a: 'You only pay for the hours your bots are active. Stop them outside trading hours and you only pay the small inactive account hosting fee.',
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Seo
        title="Pricing — Pay-As-You-Go Trading Bot Platform"
        description="No subscriptions. Pay only for what you use: $0.022/hr per active bot, $0.002/hr account hosting, $3.00 account setup. Start with as little as $5."
        path="/pricing"
        structuredData={[
          PRICING_LD,
          buildFaqLd(faqs),
          buildBreadcrumbLd([
            { name: 'Home', url: '/' },
            { name: 'Pricing', url: '/pricing' },
          ]),
        ]}
      />
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Pay Only For What You Use
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            No monthly subscriptions. No hidden fees. Backtesting is free forever.
            You only pay when your bots are running.
          </p>
        </div>

        {/* Free tier highlight */}
        <div className="mt-14 rounded-2xl border border-emerald-800/40 bg-emerald-950/20 p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-600/20">
              <Zap className="h-7 w-7 text-emerald-400" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white">Free Forever</h2>
              <p className="mt-1 text-gray-400">Everything you need to build and test strategies — no credit card required.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
                {freeFeatures.map((f) => (
                  <span key={f} className="flex items-center gap-1.5 rounded-full border border-emerald-800/40 bg-emerald-950/30 px-3 py-1 text-xs font-medium text-emerald-300">
                    <Check className="h-3 w-3" />
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <Link
              to="/signup"
              className="shrink-0 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Start Free
            </Link>
          </div>
        </div>

        {/* Cost calculator */}
        <div className="mt-12">
          <PricingCalculator />
        </div>

        {/* Usage pricing cards */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">Live Trading Rates</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pricingItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                  <Icon className="mb-3 h-8 w-8 text-violet-400" />
                  <h3 className="text-sm font-medium text-gray-400">{item.label}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-extrabold text-white">{item.price}</span>
                    <span className="ml-1 text-sm text-gray-500">{item.unit}</span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-gray-500">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cost examples */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">Monthly Cost Examples</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {examples.map((ex) => {
              const monthlyTotal = ex.breakdown.reduce((sum, b) => sum + b.cost, 0);
              const isOneTime = ex.breakdown.some(b => b.item.includes('one-time'));
              const recurringTotal = ex.breakdown
                .filter(b => !b.item.includes('one-time'))
                .reduce((sum, b) => sum + b.cost, 0);
              return (
                <div key={ex.label} className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                  <h3 className="text-lg font-bold text-white">{ex.label}</h3>
                  <p className="mt-1 text-sm text-gray-400">{ex.description}</p>
                  <div className="mt-4 space-y-2">
                    {ex.breakdown.map((b, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">{b.item}</span>
                        <span className="font-medium text-gray-200">${b.cost.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-800 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-300">Monthly recurring</span>
                        <span className="text-lg font-bold text-emerald-400">${recurringTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why PineForge */}
        <div className="mt-20">
          <h2 className="mb-10 text-center text-2xl font-bold text-white">Why PineForge?</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: FileCode, title: 'Pine Script Native', desc: 'The only platform that runs Pine Script v5 strategies directly on forex and commodities — no conversion needed.' },
              { icon: Bot, title: 'Real MT5 Execution', desc: 'Connected to Exness MT5 via MetaAPI. Your bots place real orders on a regulated broker, not a simulated exchange.' },
              { icon: BarChart3, title: 'Free Backtesting', desc: 'Run any strategy against real historical data with full performance metrics — completely free, no limits.' },
              { icon: DollarSign, title: 'No Trade Commissions', desc: 'We never take a cut of your trades. Pay only for bot runtime — your profits are 100% yours.' },
              { icon: Clock, title: '24/7 Automated', desc: 'Bots run on our cloud servers around the clock. No need to keep your computer on or MT5 open.' },
              { icon: Headphones, title: 'Support You Can Reach', desc: 'Real humans who understand trading. Not a generic help desk — actual traders and developers.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                  <Icon className="mb-3 h-8 w-8 text-emerald-400" />
                  <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="mb-10 text-center text-2xl font-bold text-white">Frequently Asked Questions</h2>
          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group rounded-xl border border-gray-800 bg-gray-900">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-medium text-gray-200 transition hover:text-white [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span className="ml-4 shrink-0 text-gray-500 transition group-open:rotate-45">+</span>
                </summary>
                <p className="px-6 pb-4 text-sm leading-relaxed text-gray-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-900/50 p-10 text-center">
          <h2 className="text-2xl font-bold text-white">Start Automating Your Trades Today</h2>
          <p className="mx-auto mt-3 max-w-lg text-gray-400">
            Backtesting is free forever. Only pay when you go live — and only for the hours you use.
          </p>
          <Link
            to="/signup"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Create Free Account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
