import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LanguageProvider } from './context/LanguageContext';
import { checkAndResetCookiesForDevice } from './utils/cookieManager';
import './styles/globals.css';

// Automatically reset cookies & stale cache if this device MAC address loads after 3 days
checkAndResetCookiesForDevice();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
