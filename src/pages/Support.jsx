import { Link } from 'react-router-dom';
import {
  Mail,
  BookOpen,
  MessageCircle,
  Code,
  Clock,
  ArrowRight,
  ExternalLink,
  Flame,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const channels = [
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Send us an email and we\'ll get back to you within 24 hours.',
    action: 'support@getpineforge.com',
    href: 'mailto:support@getpineforge.com',
    accent: 'bg-emerald-600/15 text-emerald-400',
    btn: 'bg-emerald-600 hover:bg-emerald-500 text-white',
  },
  {
    icon: BookOpen,
    title: 'Documentation',
    description: 'Find guides on backtesting, bot setup, Pine Script support, and more.',
    action: 'Read the docs',
    to: '/docs',
    accent: 'bg-blue-600/15 text-blue-400',
    btn: 'bg-blue-600 hover:bg-blue-500 text-white',
  },
  {
    icon: Code,
    title: 'GitHub',
    description: 'Report bugs, request features, or contribute to PineForge.',
    action: 'Open GitHub',
    href: 'https://github.com/lomashs09/PineForge',
    accent: 'bg-gray-600/15 text-gray-400',
    btn: 'bg-gray-700 hover:bg-gray-600 text-white',
  },
];

const faqs = [
  {
    q: 'My bot went into error state. What do I do?',
    a: 'Click Stop on the bot, wait a few seconds, then click Start again. This usually happens when the broker connection times out. If the problem persists, check that your broker account is still active.',
  },
  {
    q: 'I\'m not receiving the verification email.',
    a: 'Check your spam/junk folder. The email comes from noreply@getpineforge.com. If you still don\'t see it, click "Resend verification email" on the login page, or contact support.',
  },
  {
    q: 'Can I use PineForge with brokers other than Exness?',
    a: 'Currently we support Exness MT5 accounts only. Support for more MT5 brokers is planned. Let us know which broker you use at support@getpineforge.com.',
  },
  {
    q: 'My backtest shows different results than TradingView.',
    a: 'Small differences are normal due to different data sources and rounding. Large differences may be caused by unsupported Pine Script features. Check the docs for the list of supported functions.',
  },
  {
    q: 'Is my money safe?',
    a: 'PineForge can only place trades on your MT5 account — it cannot withdraw funds. Your MT5 password is never stored. All communication is encrypted. Withdrawals require separate authentication with your broker.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'There are no paid subscriptions yet — PineForge is free during the beta period. When we launch paid plans, you can cancel anytime from your account settings.',
  },
];

export default function Support() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            How Can We Help?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
            We're a small team and we read every message. Reach out — we'll help you get set up.
          </p>
        </div>

        {/* Contact channels */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {channels.map((ch) => {
            const Icon = ch.icon;
            return (
              <div key={ch.title} className="flex flex-col rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${ch.accent}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{ch.title}</h3>
                <p className="mb-4 flex-1 text-sm text-gray-400">{ch.description}</p>
                {ch.to ? (
                  <Link to={ch.to} className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${ch.btn}`}>
                    {ch.action} <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <a href={ch.href} target={ch.href.startsWith('http') ? '_blank' : undefined}
                     rel={ch.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                     className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${ch.btn}`}>
                    {ch.action} {ch.href.startsWith('http') ? <ExternalLink className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* Response time */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          Typical response time: within 24 hours
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
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

        {/* Emergency */}
        <div className="mt-12 rounded-2xl border border-red-900/30 bg-red-950/20 p-6 text-center">
          <h3 className="text-lg font-semibold text-red-300">Urgent: Need to stop all trades?</h3>
          <p className="mt-2 text-sm text-red-400/70">
            Go to <Link to="/bots" className="font-medium text-red-300 underline">My Bots</Link> and click Stop on each bot,
            or log into your MT5 account directly and close all positions.
            For immediate help, email{' '}
            <a href="mailto:support@getpineforge.com" className="font-medium text-red-300 underline">
              support@getpineforge.com
            </a>
          </p>
        </div>

        {/* Contact Us */}
        <div className="mt-12 rounded-2xl border border-gray-800 bg-gray-900 p-8">
          <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
          <div className="grid gap-4 sm:grid-cols-2 text-sm text-gray-300">
            <div>
              <p className="text-gray-500 mb-1">Email</p>
              <a href="mailto:lomash@getpineforge.com" className="text-emerald-400 hover:text-emerald-300">lomash@getpineforge.com</a>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Phone</p>
              <p>+91 7827XXXXXX</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Address</p>
              <p>New Delhi, India</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Business Hours</p>
              <p>Mon–Fri, 10:00 AM – 6:00 PM IST</p>
            </div>
          </div>
          <div className="mt-6 flex gap-4 text-xs text-gray-500">
            <Link to="/terms" className="hover:text-gray-300">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
            <Link to="/cancellation" className="hover:text-gray-300">Cancellation & Refund Policy</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
