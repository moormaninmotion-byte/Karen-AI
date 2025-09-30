import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Find the root DOM element where the React app will be mounted.
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element with id 'root' not found in the document.");
}

// Create a React root for the main application container.
const root = ReactDOM.createRoot(rootElement);

// Render the main App component into the root.
// React.StrictMode is used to highlight potential problems in an application.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// --- Service Worker Registration ---
// Check if the browser supports service workers.
if ('serviceWorker' in navigator) {
  // Register the service worker after the page has loaded.
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}
