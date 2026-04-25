import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, TreePine } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PaymentSuccess() {
  const { fetchUser } = useAuth();

  useEffect(() => {
    // Refresh user data so the new plan is reflected
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <TreePine className="h-8 w-8 text-emerald-500" />
          <span className="text-2xl font-bold text-white tracking-tight">PineForge</span>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle className="h-7 w-7 text-emerald-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Payment successful!</h2>
          <p className="text-sm text-gray-400 mb-6">
            Your subscription is now active. You can start using your new plan immediately.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
