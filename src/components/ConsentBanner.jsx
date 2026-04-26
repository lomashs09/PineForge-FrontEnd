import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'pf_consent';

function applyConsent(granted) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  const value = granted ? 'granted' : 'denied';
  window.gtag('consent', 'update', {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });
}

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Reading localStorage must happen post-mount so prerendered HTML and
    // first hydration agree (no window during SSG). The setState below is
    // the canonical pattern for browser-only initial state.
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function decide(granted) {
    try {
      localStorage.setItem(STORAGE_KEY, granted ? 'granted' : 'denied');
    } catch {
      // Storage blocked — still apply for this session.
    }
    applyConsent(granted);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-gray-800 bg-gray-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-gray-300 leading-relaxed">
          We use cookies for analytics and ads measurement. See our{' '}
          <Link to="/privacy" className="text-emerald-400 underline decoration-emerald-400/30 hover:decoration-emerald-400">
            privacy policy
          </Link>
          .
        </p>
        <div className="flex flex-shrink-0 gap-2">
          <button
            onClick={() => decide(false)}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:border-gray-600 hover:text-white transition"
          >
            Reject
          </button>
          <button
            onClick={() => decide(true)}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
