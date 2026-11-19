import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

try {
  registerSW({
    immediate: true,
    onRegisterError() {
      // Ignore SW registration failures in restricted environments
    },
  });
} catch {
  // Ignore SW registration errors on startup
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}
