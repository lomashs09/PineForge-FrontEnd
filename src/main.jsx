import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import { initSentry, ErrorBoundary } from './lib/sentry'

initSentry()

const container = document.getElementById('root')
function FallbackError({ error, resetError }) {
  return (
    <div style={{ padding: 40, textAlign: 'center', color: '#fff', backgroundColor: '#030712', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Something went wrong.</h1>
      <p style={{ color: '#9ca3af' }}>The error has been reported. Try refreshing the page.</p>
      <button onClick={resetError} style={{ marginTop: 16, padding: '10px 20px', borderRadius: 8, background: '#10b981', color: '#fff', border: 0, cursor: 'pointer' }}>
        Try again
      </button>
    </div>
  )
}

const tree = (
  <StrictMode>
    <HelmetProvider>
      <ErrorBoundary fallback={FallbackError}>
        <App />
      </ErrorBoundary>
    </HelmetProvider>
  </StrictMode>
)

if (container.hasChildNodes()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
