# TAIP Chrome Extension

TAIP (Text AI Processing) is a Chrome extension that provides powerful text processing capabilities using AI, right in your browser.

It uses Chrome Build-in Gemini Nano AI API for all its feature.

## Features

- **Completely Offline** and none of your text data is shared to any AI.
- **Rewrite Text**: Rephrase and restructure your text while maintaining its original meaning.
- **Correct English**: Fix grammar, spelling, and punctuation errors in your text.
- **Translate to English**: Convert text from various languages into English.
- **Summarize Text**: Create concise summaries of longer texts.
- **Answer in Short**: Generate brief answers to questions or prompts.
- **Custom Instructions**: Provide your own specific instructions for text processing.

## Installation

1. Install [Chrome Canary](https://www.google.com/chrome/canary/)
2. Enable Chrome Flags to enable Gemini AI
  2.1 [Enable "Prompt API for Gemini Nano" Flags](chrome://flags/#prompt-api-for-gemini-nano)
  2.2 [Enable "Summarization API for Gemini Nano" Flags](chrome://flags/#summarization-api-for-gemini-nano)
  2.3 [Enable "Enables optimization guide on device" Flags](chrome://flags/#optimization-guide-on-device-model)
3. Install the extenstion from [chrome web store](https://chromewebstore.google.com/detail/taip/eilhppfpdmfkijcdjcbhenlnmgjibfld)

## Dev Installation

1. Install [Chrome Canary](https://www.google.com/chrome/canary/)
2. Enable Chrome Flags to enable Gemini AI
  2.1 [Enable "Prompt API for Gemini Nano" Flags](chrome://flags/#prompt-api-for-gemini-nano)
  2.2 [Enable "Summarization API for Gemini Nano" Flags](chrome://flags/#summarization-api-for-gemini-nano)
  2.3 [Enable "Enables optimization guide on device" Flags](chrome://flags/#optimization-guide-on-device-model)
3. Download the latest release zip from [Release](https://github.com/stricks-inc/taip-build-in-gemini-nano-chrome-extension/releases)
4. Upzip the `taip-*.zip` file
5. Open Chrome and navigate to `chrome://extensions`.
6. Enable "Developer mode" in the top right corner.
7. Click "Load unpacked" and select the unziped folder.

## Getting started to use

1. Click on the TAIP extension icon in your Chrome browser.
2. Enter your email (No verification needed)
3. Enable the flags and wait for the chrome to download the models
4. Copy the text you want to transform or precess
5. Press cmd/ctrl + shift + U to activate extention.
6. Press/select number keys from the given options (1 -6)
4. Transformed text copied to clipboard, press cmd/ctrl + v to paste.


## Development

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Setup

1. Clone the repository:
```sh
git clone git@github.com:stricks-inc/taip-build-in-gemini-nano-chrome-extension.git
```

2. Navigate to the project directory:

```sh
cd taip-build-in-gemini-nano-chrome-extension
```

3. Install dependencies:
```sh
npm install
```
4. Build the extension locally:

```sh
npm run watch
```

5. Load the `~/taip-build-in-gemini-nano-chrome-extension/dist` folder as an unpacked extension in Chrome.

6. (Optional) Create a Firebase project whose firestore will be used as database to store email.
7. (Optional) Update `src/services/firebaseConfig.js` with your Firebase configuration.

### Building for production

Run the following command to create a production build:
```
npm run build
```

Zip the `dist` folder and updload in the chrome store

## Technologies Used

- React
- Webpack
- Tailwind
- Firebase Firestore
- Chrome Extension APIs


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License


