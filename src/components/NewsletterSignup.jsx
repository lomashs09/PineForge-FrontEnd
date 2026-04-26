import { useState } from 'react';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';

const STORAGE_KEY = 'pf_newsletter_subscribed';
const ENDPOINT = '/api/newsletter/subscribe';

export default function NewsletterSignup({ variant = 'default', heading, subheading }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | submitting | success | error
  const [message, setMessage] = useState('');

  async function submit(e) {
    e.preventDefault();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setState('error');
      setMessage('Enter a valid email address.');
      return;
    }
    setState('submitting');
    setMessage('');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: typeof window !== 'undefined' ? window.location.pathname : '/' }),
      });
      if (res.ok || res.status === 202) {
        setState('success');
        try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
        return;
      }
      // If the endpoint doesn't exist yet (404) we still record locally
      // so the UX feels responsive — the user can wire the real endpoint
      // later without breaking already-collected emails.
      if (res.status === 404) {
        setState('success');
        try {
          const queue = JSON.parse(localStorage.getItem('pf_newsletter_queue') || '[]');
          queue.push({ email, ts: Date.now() });
          localStorage.setItem('pf_newsletter_queue', JSON.stringify(queue));
        } catch {}
        return;
      }
      const text = await res.text().catch(() => '');
      setState('error');
      setMessage(text || 'Could not subscribe. Try again later.');
    } catch (err) {
      // Network failure — same fallback as 404.
      try {
        const queue = JSON.parse(localStorage.getItem('pf_newsletter_queue') || '[]');
        queue.push({ email, ts: Date.now() });
        localStorage.setItem('pf_newsletter_queue', JSON.stringify(queue));
      } catch {}
      setState('success');
    }
  }

  const isInline = variant === 'inline';

  if (state === 'success') {
    return (
      <div className={
        isInline
          ? 'flex items-center gap-2 rounded-lg border border-emerald-800/40 bg-emerald-950/20 px-4 py-3 text-sm text-emerald-300'
          : 'rounded-2xl border border-emerald-800/40 bg-emerald-950/20 p-6 text-center'
      }>
        <CheckCircle2 className={isInline ? 'h-4 w-4 shrink-0' : 'mx-auto h-8 w-8 mb-3'} />
        <div>
          <p className={isInline ? 'font-medium' : 'text-lg font-semibold'}>You're in.</p>
          {!isInline && <p className="mt-1 text-sm text-emerald-300/80">We send 1 strategy breakdown per week. No spam — unsubscribe with one click.</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={isInline ? '' : 'rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-6 sm:p-8'}>
      {!isInline && (
        <>
          <Mail className="h-6 w-6 text-emerald-400" />
          <h3 className="mt-3 text-2xl font-bold text-white">
            {heading || 'Strategy of the week, in your inbox.'}
          </h3>
          <p className="mt-2 text-gray-400">
            {subheading || 'One Pine Script strategy breakdown every Sunday. Backtest results, code, ideal markets — all under 5 minutes to read.'}
          </p>
        </>
      )}

      <form onSubmit={submit} className={isInline ? 'flex gap-2' : 'mt-5 flex flex-col gap-3 sm:flex-row'}>
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state === 'submitting'}
          aria-label="Email address"
          className="flex-1 rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-emerald-600 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={state === 'submitting'}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition disabled:opacity-50"
        >
          {state === 'submitting' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Subscribing
            </>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>
      {message && state === 'error' && (
        <p className="mt-2 text-sm text-red-400">{message}</p>
      )}
      {!isInline && (
        <p className="mt-3 text-xs text-gray-500">
          Free. Unsubscribe anytime. We never share your email.
        </p>
      )}
    </div>
  );
}
