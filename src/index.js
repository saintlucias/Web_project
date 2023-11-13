// Import React and ReactDOM
import React from 'react';
import ReactDOM from 'react-dom/client';

// Import your main App component
import App from './App';

// Import the reportWebVitals function
import reportWebVitals from './reportWebVitals';

// Create a root using ReactDOM.createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

// Save a reference to the original console.error
const originalConsoleError = console.error;

// Suppress the specific warning
console.error = (message) => {
  if (message.startsWith('Warning: validateDOMNesting')) {
    return;
  }
  originalConsoleError(message);
};

// Render your app within the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Report web vitals
reportWebVitals();