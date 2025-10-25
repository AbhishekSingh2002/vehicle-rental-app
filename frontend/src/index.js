import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/modernUI.css';
import './styles/debug-fix.css'; // Temporary debug styles - import last
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
