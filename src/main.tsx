import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import * as Sentry from "@sentry/react";
import './index.css'
import App from './App.tsx'
import { initAnalytics } from './lib/analytics'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// Deferred until window `load` so analytics never competes with the page's
// own critical rendering path. initAnalytics() itself checks cookie consent
// before loading anything.
if (document.readyState === 'complete') {
  setTimeout(initAnalytics, 1);
} else {
  window.addEventListener('load', () => setTimeout(initAnalytics, 1));
}

// Automatically reload on stale dynamic import after deployment
window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
