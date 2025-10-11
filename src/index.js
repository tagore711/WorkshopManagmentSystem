import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; 

// If you were using a separate CSS file for global styles (like Tailwind imports), 
// you would import it here:


// Use the standard 'root' element defined in your public/index.html
const rootElement = document.getElementById('root');

// Create the root container and render the main App component
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
