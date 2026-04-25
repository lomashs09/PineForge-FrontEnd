import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, TreePine } from 'lucide-react';
import api from '../services/api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }

    api
      .post('/auth/verify-email', { token })
      .then(({ data }) => {
        setStatus('success');
        setMessage(data.message);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.detail || 'Verification failed. The link may have expired.');
      });
  }, [token]);

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
          {status === 'verifying' && (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center">
                <span className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-white">Verifying your email...</h2>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle className="h-7 w-7 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Email verified!</h2>
              <p className="text-sm text-gray-400 mb-6">{message}</p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition"
              >
                Log in to your account
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                <XCircle className="h-7 w-7 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Verification failed</h2>
              <p className="text-sm text-gray-400 mb-6">{message}</p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-6 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 transition"
              >
                Try signing up again
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
