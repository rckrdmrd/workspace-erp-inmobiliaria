import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './shared/styles/index.css';
import { runMigrations } from './shared/utils/migrateLocalStorage';

// Run localStorage migrations before app initialization
// This ensures backward compatibility for users with existing sessions
runMigrations();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
