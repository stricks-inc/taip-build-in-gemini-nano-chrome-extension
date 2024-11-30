console.log('Background script running');

import { initLanguageModel, isLanguageModelAvailable } from './ai';
import { saveEmail } from './firebase';


chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  var data = message.data;
  console.log("Background script message", message);
  if (message.command === 'save_email') {
    saveEmail(data.email);
    chrome.storage.local.set({ email: data.email }, () => {
      sendResponse({ success: true });
    });
    return true;
  }else if (message.command === 'get_email') {
    chrome.storage.local.get(['email'], (result) => {
      console.log("Background script received email", result);
      sendResponse({ data: result.email });
    });
    return true;
  } else if (message.command === 'get_popup_state') {
    chrome.storage.local.get(['email'], async (result) => {
      sendResponse({ 
        data: {
          email: result.email,
          isAiAvailable: isLanguageModelAvailable()
        }
      });
    });
    return true;
  }
});

chrome.commands.onCommand.addListener((command) => {
  console.log('command', command);
  if (command === "activate") {
    chrome.storage.local.get(['email'], (result) => {
      if (!result.email) {
       chrome.action.openPopup();
      }else {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, {command: "toggle_visibility"});
            initLanguageModel();
          }
        });
      }

    });

    return true;
  }
});


