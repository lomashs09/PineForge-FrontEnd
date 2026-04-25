import { Link } from 'react-router-dom';
import {
  Flame,
  Target,
  Shield,
  Zap,
  Users,
  Globe,
  Code,
  ArrowRight,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const values = [
  {
    icon: Target,
    title: 'Strategy First',
    description:
      'We believe every trader deserves institutional-grade automation. Your strategy, your rules, running 24/7.',
  },
  {
    icon: Shield,
    title: 'Security by Design',
    description:
      'Your MT5 passwords are never stored. We use encrypted provisioning and your trades go directly to your broker.',
  },
  {
    icon: Zap,
    title: 'Real Execution',
    description:
      'No paper trading gimmicks. PineForge connects to real MT5 broker accounts and places real orders.',
  },
  {
    icon: Code,
    title: 'Pine Script Native',
    description:
      'The only platform with a full Pine Script v5 interpreter. No conversion, no limitations — your TradingView strategies run as-is.',
  },
];

const stats = [
  { value: '28+', label: 'Built-in Strategies' },
  { value: '10+', label: 'Supported Symbols' },
  { value: '5', label: 'Timeframes' },
  { value: '24/7', label: 'Automated Trading' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6">
        {/* Hero */}
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
            <Flame className="h-4 w-4" />
            About PineForge
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Automating Trading for{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Everyone
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            PineForge turns your TradingView Pine Script strategies into fully automated
            trading bots running on real MT5 broker accounts. Built by traders, for traders.
          </p>
        </div>

        {/* Story */}
        <div className="mt-20 rounded-2xl border border-gray-800 bg-gray-900 p-8 sm:p-10">
          <h2 className="mb-4 text-2xl font-bold text-white">Our Story</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              We started PineForge because we were frustrated. We had profitable strategies
              on TradingView, but there was no simple way to automate them on a real broker
              account without expensive infrastructure or complex coding.
            </p>
            <p>
              So we built a Pine Script v5 interpreter from scratch — a lexer, parser, and
              tree-walking interpreter that executes your strategies bar-by-bar, exactly like
              TradingView does. Then we connected it to MT5 brokers for real-time execution.
            </p>
            <p>
              Today, PineForge lets you pick a strategy, backtest it on real market data,
              and deploy it as a 24/7 automated trading bot — all from your browser.
              No coding required. No server setup. Just pick, test, and trade.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-gray-800 bg-gray-900 p-5 text-center">
              <p className="text-3xl font-extrabold text-emerald-400">{s.value}</p>
              <p className="mt-1 text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mt-20">
          <h2 className="mb-10 text-center text-2xl font-bold text-white">What We Believe</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                  <Icon className="mb-3 h-8 w-8 text-emerald-400" />
                  <h3 className="mb-2 text-lg font-semibold text-white">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-white">Ready to automate your trading?</h2>
          <p className="mt-3 text-gray-400">Start with 2 free bots. No credit card required.</p>
          <Link
            to="/signup"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
