import React from 'react';
import ReactDOM from 'react-dom/client';
import './../tailwind.css';
import Popup from './Popup';
import './index.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

root.className = "taip-extension-popup";
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);