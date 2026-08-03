import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Prevent uncaught iframe script errors from breaking the app or throwing unhandled exceptions
window.onerror = function (message, source, lineno, colno, error) {
  console.warn('Suppressed script error:', message, source);
  return true; // Prevents the error from propagating to browser error reporting
};

window.addEventListener('unhandledrejection', (event) => {
  console.warn('Caught unhandled rejection:', event.reason);
  event.preventDefault?.();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

