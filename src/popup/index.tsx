import React from 'react';
import ReactDOM from 'react-dom/client';
import './../tailwind.css';
import Popup from './Popup';
import './index.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

let isOriginTrialTokenAdded = false;


const addOriginTrialToken = (token: string) => {
  const otMeta = document.createElement('meta');
  otMeta.httpEquiv = 'origin-trial';
  otMeta.content = token;
  document.head.append(otMeta);
};

const addAllOriginTrialTokens = (tokens: string[]) => {
  tokens.forEach((token: string) => {
    addOriginTrialToken(token);
  });
};

if (!isOriginTrialTokenAdded) {
  addAllOriginTrialTokens(chrome.runtime.getManifest().trial_tokens as string[]);
  isOriginTrialTokenAdded = true;
}

root.className = "taip-extension-popup";
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);