import * as Sentry from "@sentry/react";
import ReactGA from "react-ga4";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

Sentry.init({
  dsn: "https://0535e3176ee49d5ce5f77b50a174f984@o4511454299422720.ingest.us.sentry.io/4511454308007936",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

ReactGA.initialize("G-XMLLV210SV");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)