# TAIP Chrome Extension

TAIP (Text AI Processing) is a Chrome extension that provides powerful text processing capabilities using AI, right in your browser.

## Features

- Rewrite Text: Rephrase and restructure your text while maintaining its original meaning.
- Correct English: Fix grammar, spelling, and punctuation errors in your text.
- Translate to English: Convert text from various languages into English.
- Summarize Text: Create concise summaries of longer texts.
- Answer in Short: Generate brief answers to questions or prompts.
- Custom Instructions: Provide your own specific instructions for text processing.

## Installation

1. Clone this repository or download the ZIP file.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the project folder.

## Usage

1. Click on the TAIP extension icon in your Chrome browser.
2. Log in using your Gmail account.
3. Enter or paste your text into the input field.
4. Select the desired processing option.
5. View the processed text in the output area.
6. Copy the result to your clipboard or use it directly in your browser.

## Development

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Setup

1. Clone the repository:
```sh
git clone git@github.com:stricks-inc/taip-chrome-extension.git
```

2. Navigate to the project directory:

```sh
cd taip-extension
```

3. Install dependencies:
```sh
npm install
```

4. Create a Firebase project and set up authentication.
5. Update `src/services/firebaseConfig.js` with your Firebase configuration.

### Running locally

1. Start the development server:

```sh
npm start
```

2. Load the `build` folder as an unpacked extension in Chrome.

### Building for production

Run the following command to create a production build:
```
npm run build
```

## Technologies Used

- React
- Firebase Authentication
- Chrome Extension APIs

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under copywrite Stricks@2024. 
Commercial use without informing the owners is not permitted


