import React from 'react';
import ReactDOM from 'react-dom/client';
import Content from './Content';
import './index.css';
import IsolatedStylesWrapper from './IsolatedStylesWrapper';

// Add this function to inject the Google Fonts stylesheet
function injectGoogleFonts() {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

// Call the function to inject the stylesheet
injectGoogleFonts();

const app = document.createElement('div');
app.id = 'taip-content-root';
app.className = 'taip-extension-root';
document.body.appendChild(app);

console.log("Content script loaded");

const root = ReactDOM.createRoot(app);
root.render(
  <React.StrictMode>
    <IsolatedStylesWrapper>
      <Content />
    </IsolatedStylesWrapper>
  </React.StrictMode>
);