// Frontend Sentry initialiser — only fires when VITE_SENTRY_DSN is set.
// Drop your DSN into .env (or Vercel env vars) as VITE_SENTRY_DSN and
// the SPA starts capturing errors and performance traces immediately.
//
// Why: backend Sentry catches API and worker crashes, but a React render
// crash, an unhandled promise rejection in the SPA, or a failed fetch
// from the browser are entirely invisible without frontend Sentry.

import * as Sentry from '@sentry/react';

let initialised = false;

export function initSentry() {
  if (initialised) return;
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return; // No-op in dev / when DSN not configured.

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 1.0,
    // Avoid noisy errors from browser extensions.
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Non-Error promise rejection captured',
    ],
  });

  initialised = true;
}

export const ErrorBoundary = Sentry.ErrorBoundary;
export const captureException = (err, ctx) => {
  if (!initialised) return;
  Sentry.captureException(err, ctx);
};
