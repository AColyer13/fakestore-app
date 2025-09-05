import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx';
import { ToastProvider } from './components/ToastContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

function setTheme() {
  // Dark mode support
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light');
}

function setReducedMotion() {
  // Reduced motion support
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('motion-reduce');
  } else {
    document.body.classList.remove('motion-reduce');
  }
}

function BootstrapThemeManager({ children }) {
  useEffect(() => {
    setTheme();
    setReducedMotion();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme);
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', setReducedMotion);
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', setTheme);
      window.matchMedia('(prefers-reduced-motion: reduce)').removeEventListener('change', setReducedMotion);
    };
  }, []);
  return children;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BootstrapThemeManager>
      <ToastProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ToastProvider>
    </BootstrapThemeManager>
  </StrictMode>,
);
