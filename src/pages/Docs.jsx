import { Link } from 'react-router-dom';
import {
  Flame,
  BookOpen,
  Rocket,
  Bot,
  FlaskConical,
  FileCode,
  Wallet,
  Shield,
  HelpCircle,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const sections = [
  {
    id: 'getting-started',
    icon: Rocket,
    title: 'Getting Started',
    content: [
      {
        q: '1. Create an account',
        a: 'Sign up at getpineforge.com/signup with your email. You\'ll receive a verification email — click the link to activate your account.',
      },
      {
        q: '2. Connect your MT5 broker',
        a: 'Go to Accounts → Connect Account. You\'ll need your Exness MT5 login number, trading password, and server name (e.g. Exness-MT5Trial6 for demo). Your password is used once for verification via an encrypted connection and is never stored.',
      },
      {
        q: '3. Choose a strategy',
        a: 'Browse 28+ pre-built Pine Script strategies in the Strategies page, or upload your own. Each strategy can be backtested before going live.',
      },
      {
        q: '4. Backtest it',
        a: 'Go to Backtest, select your strategy, symbol (e.g. XAUUSD), timeframe, and date range. Click Run Backtest to see performance metrics, equity curve, and trade log.',
      },
      {
        q: '5. Create and start a bot',
        a: 'Go to My Bots → Create Bot. Select your broker account, strategy, symbol, timeframe, and lot size. Toggle Live Trading on for real orders, or leave it off for dry-run mode. Click Start.',
      },
    ],
  },
  {
    id: 'backtesting',
    icon: FlaskConical,
    title: 'Backtesting',
    content: [
      {
        q: 'What data is used?',
        a: 'Daily and hourly data comes from Yahoo Finance (up to 5 years). For 5-minute and 15-minute intervals, we use Twelve Data which provides up to 1 year of intraday history.',
      },
      {
        q: 'What does "next-bar-open" execution mean?',
        a: 'When your strategy generates a signal on bar N, the order fills at bar N+1\'s opening price. This matches TradingView\'s default behavior and produces realistic results.',
      },
      {
        q: 'Can I set the quantity?',
        a: 'Yes. The Quantity field in the backtest form overrides the strategy\'s default. Leave it empty to use the script\'s built-in default_qty_value.',
      },
      {
        q: 'Why do some strategies show 0 trades?',
        a: 'The strategy\'s entry conditions may not be met for the selected symbol/timeframe/date range. Try a different timeframe or a longer date range.',
      },
    ],
  },
  {
    id: 'bots',
    icon: Bot,
    title: 'Trading Bots',
    content: [
      {
        q: 'How do bots work?',
        a: 'Each bot runs your Pine Script strategy in real-time. It polls for new candles at your chosen interval, evaluates the strategy, and executes trades directly on your MT5 account.',
      },
      {
        q: 'What is dry-run mode?',
        a: 'With Live Trading OFF, the bot simulates trades without placing real orders. Use this to test your strategy in real-time conditions before risking money.',
      },
      {
        q: 'How many bots can I run?',
        a: 'Free plan: 2 bots, 1 broker account. Paid plans offer more — see the Pricing page.',
      },
      {
        q: 'What happens during server maintenance?',
        a: 'Bots automatically restart after the server comes back online. If a restart fails, the bot shows an "error" status — just click Start to retry.',
      },
      {
        q: 'Can I see my bot\'s trades?',
        a: 'Yes. Click the logs icon on any bot to see the Logs and Trades tabs. Trades show entry price, direction, lot size, order ID, and P&L.',
      },
    ],
  },
  {
    id: 'strategies',
    icon: FileCode,
    title: 'Pine Script Strategies',
    content: [
      {
        q: 'What Pine Script version is supported?',
        a: 'PineForge supports Pine Script v5. Most TradingView strategies with strategy() declarations will work. Indicator-only scripts (using indicator()) are not supported — they need strategy.entry()/strategy.close() calls.',
      },
      {
        q: 'Can I upload my own strategy?',
        a: 'Yes. Go to Strategies → Upload Strategy. Paste your Pine Script code, give it a name, and submit. The system validates it by parsing the script before saving.',
      },
      {
        q: 'What built-in indicators are supported?',
        a: 'SMA, EMA, RSI, MACD, Bollinger Bands, ATR, Stochastic, Donchian Channel, and more. Most ta.* functions from TradingView are implemented.',
      },
      {
        q: 'What\'s NOT supported?',
        a: 'Plots, shapes, colors, labels (visual-only features). Also: request.security() (multi-timeframe), arrays, maps, and some advanced Pine Script v5 features. If your script uses these, it may need modification.',
      },
    ],
  },
  {
    id: 'accounts',
    icon: Wallet,
    title: 'Broker Accounts',
    content: [
      {
        q: 'Which brokers are supported?',
        a: 'Currently Exness (MT5). Both real and demo accounts are supported. More brokers coming soon.',
      },
      {
        q: 'Is my password safe?',
        a: 'Yes. Your MT5 password is used once for account verification via an encrypted connection. We never store your password in our database.',
      },
      {
        q: 'How do I find my MT5 server name?',
        a: 'In your Exness Personal Area under My Accounts, the server name is shown (e.g. Exness-MT5Trial6 for demo, Exness-MT5Real for live). You can also find it in the MT5 app under File → Login to Trade Account.',
      },
    ],
  },
  {
    id: 'security',
    icon: Shield,
    title: 'Security',
    content: [
      {
        q: 'How is my data protected?',
        a: 'All connections use HTTPS/TLS encryption. Your MT5 password is never stored. JWT tokens expire after 1 hour. The platform uses bcrypt for password hashing.',
      },
      {
        q: 'Can PineForge access my broker funds?',
        a: 'PineForge can only place trades on your MT5 account — it cannot withdraw funds. Withdrawals require separate authentication directly with your broker.',
      },
      {
        q: 'Who can see my strategies?',
        a: 'Your custom strategies are private by default. Only you can see and use them. System strategies are visible to all users.',
      },
    ],
  },
];

export default function Docs() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6">
        {/* Header */}
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
            <BookOpen className="h-4 w-4" />
            Documentation
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Learn PineForge
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Everything you need to know about backtesting, deploying bots, and managing your trading strategies.
          </p>
        </div>

        {/* Quick nav */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-sm text-gray-300 transition hover:border-emerald-500/30 hover:text-emerald-400"
              >
                <Icon className="h-4 w-4" />
                {s.title}
              </a>
            );
          })}
        </div>

        {/* Sections */}
        <div className="mt-16 space-y-16">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} id={section.id}>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/15">
                    <Icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                </div>
                <div className="space-y-4">
                  {section.content.map((item, i) => (
                    <div key={i} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                      <h3 className="mb-2 text-sm font-semibold text-white">{item.q}</h3>
                      <p className="text-sm leading-relaxed text-gray-400">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* API reference link */}
        <div className="mt-16 rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center">
          <h2 className="text-xl font-bold text-white">API Reference</h2>
          <p className="mt-2 text-gray-400">
            PineForge has a full REST API with Swagger documentation.
          </p>
          <a
            href="https://api.getpineforge.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-800 px-6 py-2.5 text-sm font-medium text-gray-200 transition hover:bg-gray-700 hover:text-white"
          >
            Open Swagger UI
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Still need help */}
        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Can't find what you're looking for?{' '}
            <Link to="/support" className="text-emerald-400 hover:text-emerald-300">
              Contact support
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
