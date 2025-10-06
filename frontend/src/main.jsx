import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

// WordPress compatibility - expose mount function
window.MotivationLetterApp = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      ReactDOM.createRoot(container).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    }
  }
};

// Standard mount for standalone usage
if (document.getElementById('root')) {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}