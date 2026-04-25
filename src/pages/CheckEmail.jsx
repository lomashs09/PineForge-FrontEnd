import { useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { Mail, TreePine, RefreshCw } from 'lucide-react';
import api from '../services/api';

export default function CheckEmail() {
  const location = useLocation();
  const email = location.state?.email;
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [resendError, setResendError] = useState('');

  if (!email) {
    return <Navigate to="/signup" />;
  }

  async function handleResend() {
    setResending(true);
    setResendError('');
    try {
      await api.post('/auth/resend-verification', { email });
      setResent(true);
    } catch (err) {
      if (err.response?.status === 429) {
        setResendError(err.response.data?.detail || 'Too many requests. Please wait before trying again.');
      }
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <TreePine className="h-8 w-8 text-emerald-500" />
          <span className="text-2xl font-bold text-white tracking-tight">
            PineForge
          </span>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
            <Mail className="h-7 w-7 text-emerald-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Check your email</h2>
          <p className="text-sm text-gray-400 mb-6">
            We sent a verification link to{' '}
            <span className="text-white font-medium">{email}</span>.
            <br />
            Click the link to activate your account.
          </p>

          <button
            onClick={handleResend}
            disabled={resending || resent}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
          >
            {resending ? (
              <span className="h-4 w-4 border-2 border-gray-500 border-t-gray-300 rounded-full animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {resent ? 'Verification email resent!' : "Didn't get it? Resend"}
          </button>

          {resendError && (
            <p className="mt-3 text-sm text-red-400">{resendError}</p>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already verified?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
