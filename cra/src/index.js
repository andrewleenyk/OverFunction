import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './theme.css';
import './styles.css';
import App from './App';
import { initTheme } from './theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
initTheme();
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// CRA vitals removed
