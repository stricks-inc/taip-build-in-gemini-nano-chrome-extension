export const BUTTON_CONFIG = [
  {
    promptName: "REWRITE",
    label: "Rewrite Text",
    buttonText: "1",
    prompt: (text: string, instruction?: string) => `you need to rewrtire the given text. The given text is ---- ${text} ---- Just directly write the output as normal text`,
  },
  {
    promptName: "CORRECT_ENGLISH",
    label: "Correct Englist",
    buttonText: "2",
    prompt: (text: string, instruction?: string) => `you need to correct the English, grammar, punctuation and spelling for the given text. The given text is ---- ${text} ---- Just directly write the output as normal text`,
  },
  {
    promptName: "TRANSLATE_TO_ENGLISH",
    label: "Translate to English",
    buttonText: "3",
    prompt: (text: string, instruction?: string) => `you need to translate the given text to English. The given text is ---- ${text} ---- Just directly write the output as normal text`,
  },
  {
    promptName: "SUMMARIZE",
    label: "Summarize the text",
    buttonText: "4",
    prompt: (text: string, instruction?: string) => `you need to summarize the given text. The given text is ---- ${text} ---- Just directly write the output as normal text`,
  },
  {
    promptName: "ANSWER_IN_SHORT",
    label: "Answer in short",
    buttonText: "5",
    prompt: (text: string, instruction?: string) => `you need to answer the given question in less then 100 words. The given question is ---- ${text} ---- Just directly write the output as normal text`,
  },
  {
    promptName: "CUSTOM",
    label: "Custom",
    buttonText: "6",
    prompt: (text: string, instruction?: string) => `you need to transform the given text based on the given instruction. The given text is ---- ${text} ---- The given instruction is ---- ${instruction} ---- Just directly write the output as normal text`,
  },
];

export const getPrompt = (buttonText: string): {promptName: string, prompt: (text: string, instruction?: string) => string} | undefined => {
  return BUTTON_CONFIG.find((button) => button.buttonText === buttonText);
};
export const validateInput = (
  promptName: string,
  input: string,
  instruction: string,
  onError: (message: string) => void
) => {
  if (input.length === 0) {
    onError("Please select text first.");
    return false;
  }

  if (promptName === "CUSTOM" && instruction.length === 0) {
    onError("Please enter custom instructions.");
    return false;
  }

  // save last validated instruction to local storage
  if (promptName === "CUSTOM") {
    chrome.storage.local.set({ instruction });
  }

  return true;
};

export function debounce(func: () => void, delay: number = 200) {
  let timeoutId: number;
  return function () {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      func();
    }, delay);
  };
}


export const handleTranform = (
  promptName: string,
  input: string,
  instruction: string,
  isLoading: boolean,
  setIsLoading: (loading: boolean) => void,
  showInfoPopup: boolean,
  setShowInfoPopup: (show: boolean) => void,
  setErrorMessage: (message: string) => void,
  onSuccessfulTransform: (text: string) => void
) => {
  if (isLoading) {
    console.log("handleTranform still loading", isLoading);
    return;
  }

  if (!validateInput(promptName, input, instruction, setErrorMessage)) {
    return;
  }

  setIsLoading(true); // show loading indicator
  setErrorMessage("");
  console.log("summarizing with buildIn AI");
  const prompt = BUTTON_CONFIG.find((button) => button.promptName === promptName);
  if (!prompt) {
    setErrorMessage("Something went wrong. Please try again.");
    return;
  }
  chrome.runtime.sendMessage({ command: "handle_transform", data: { text: input, instruction: prompt.prompt(input, instruction), promptName: prompt.promptName} }, (response) => {
    console.log("handle_transform response", response);
    if (response.success) {
      onSuccessfulTransform(response.text);
    } else {
      setErrorMessage(response.error);
    }
    setIsLoading(false);
    if (showInfoPopup) {
      // hide info popup after 2 seconds
      console.log("hiding info popup");
      setTimeout(() => {
        setShowInfoPopup(false);
      }, 2000);
    }
  });
};
