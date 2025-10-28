import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/debug-fix.css'; // Temporary debug styles - import last
import App from './App';

// Force fresh session: require login on first open
try {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
} catch (_) {}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
