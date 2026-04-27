// Frontend Sentry initialiser. The default DSN below targets the PineForge
// React project on Sentry. Override via VITE_SENTRY_DSN (e.g. for staging
// or a fork). DSNs are designed to be public (they're embedded in the
// shipped bundle anyway), so committing one here is safe.
//
// Why: backend Sentry catches API and worker crashes, but a React render
// crash, an unhandled promise rejection in the SPA, or a failed fetch
// from the browser are entirely invisible without frontend Sentry.

import * as Sentry from '@sentry/react';

const DEFAULT_DSN =
  'https://ccdd556b5df275b529c476ea62f466fd@o4511287795318784.ingest.de.sentry.io/4511291080507472';

let initialised = false;

export function initSentry() {
  if (initialised) return;
  const dsn = import.meta.env.VITE_SENTRY_DSN || DEFAULT_DSN;
  if (!dsn) return; // No-op when explicitly cleared.

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION,
    sendDefaultPii: true,
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
