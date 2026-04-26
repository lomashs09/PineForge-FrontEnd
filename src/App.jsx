import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ConsentBanner from './components/ConsentBanner';

// Public pages — eagerly imported so prerender captures them and the SPA
// shell hydrates immediately for crawlers and first-time visitors.
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import StrategyHub from './pages/StrategyHub';
import StrategyDetail from './pages/StrategyDetail';
import SymbolHub from './pages/SymbolHub';
import SymbolDetail from './pages/SymbolDetail';
import GlossaryHub from './pages/GlossaryHub';
import GlossaryEntry from './pages/GlossaryEntry';
import CompareHub from './pages/CompareHub';
import CompareDetail from './pages/CompareDetail';
import ToolsHub from './pages/ToolsHub';
import PositionSizeCalculator from './pages/tools/PositionSizeCalculator';
import RiskRewardCalculator from './pages/tools/RiskRewardCalculator';
import DrawdownRecoveryCalculator from './pages/tools/DrawdownRecoveryCalculator';
import Changelog from './pages/Changelog';
import Press from './pages/Press';
import GuidesHub from './pages/GuidesHub';
import PillarPage from './pages/PillarPage';
import Onboarding from './pages/Onboarding';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Docs from './pages/Docs';
import Support from './pages/Support';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cancellation from './pages/Cancellation';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

// Auth flow — lightweight, but lazy keeps the initial bundle clean.
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const CheckEmail = lazy(() => import('./pages/CheckEmail'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));

// Authenticated app — never shipped to anonymous public visitors.
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Bots = lazy(() => import('./pages/Bots'));
const Strategies = lazy(() => import('./pages/Strategies'));
const Backtest = lazy(() => import('./pages/Backtest'));
const Accounts = lazy(() => import('./pages/Accounts'));
const Billing = lazy(() => import('./pages/Billing'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));

function PageSpinner() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageSpinner />;
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/support" element={<Support />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/bots" element={<ProtectedRoute><Bots /></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><Strategies /></ProtectedRoute>} />
        <Route path="/strategies" element={<StrategyHub />} />
        <Route path="/strategies/:slug" element={<StrategyDetail />} />
        <Route path="/symbols" element={<SymbolHub />} />
        <Route path="/symbols/:slug" element={<SymbolDetail />} />
        <Route path="/glossary" element={<GlossaryHub />} />
        <Route path="/glossary/:slug" element={<GlossaryEntry />} />
        <Route path="/compare" element={<CompareHub />} />
        <Route path="/compare/:slug" element={<CompareDetail />} />
        <Route path="/tools" element={<ToolsHub />} />
        <Route path="/tools/position-size-calculator" element={<PositionSizeCalculator />} />
        <Route path="/tools/risk-reward-calculator" element={<RiskRewardCalculator />} />
        <Route path="/tools/drawdown-recovery-calculator" element={<DrawdownRecoveryCalculator />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/press" element={<Press />} />
        <Route path="/guides" element={<GuidesHub />} />
        <Route path="/guides/:slug" element={<PillarPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/backtest" element={<ProtectedRoute><Backtest /></ProtectedRoute>} />
        <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cancellation" element={<Cancellation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1f2937', color: '#f3f4f6', border: '1px solid #374151' },
          }}
        />
        <AppRoutes />
        <ConsentBanner />
      </AuthProvider>
    </BrowserRouter>
  );
}
