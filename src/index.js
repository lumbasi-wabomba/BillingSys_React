import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Assumes you have an App.js in the same folder

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);