export const BUTTON_CONFIG = [
  {
    promptName: "REWRITE",
    label: "Rewrite Text",
    buttonText: "1",
    prompt: (text: string, instruction?: string) => `Rephrase the below text \n <text> ${text} </text \n direcltly share the rephrased text in plan textand nothing else`,
  },
  {
    promptName: "CORRECT_ENGLISH",
    label: "Correct Englist",
    buttonText: "2",
    prompt: (text: string, instruction?: string) => `Just Correct the English, grammar, punctuation and spelling for the below text \n <text> ${text} </text>`,
  },
  {
    promptName: "TRANSLATE_TO_ENGLISH",
    label: "Translate to English",
    buttonText: "3",
    prompt: (text: string, instruction?: string) => `Identify the language of below text and transform it to English. \n <text> ${text} </text> \n Only Share the transformed text and nothing else`,
  },
  {
    promptName: "SUMMARIZE",
    label: "Summarize the text",
    buttonText: "4",
    prompt: (text: string, instruction?: string) => `Summarize the below text in less then 100 words \n <text> ${text} </text>`,
  },
  {
    promptName: "ANSWER_IN_SHORT",
    label: "Answer in short",
    buttonText: "5",
    prompt: (text: string, instruction?: string) => `Answer the below question in less then 100 words. \n <question> ${text} </question>`,
  },
  {
    promptName: "CUSTOM",
    label: "Custom",
    buttonText: "6",
    prompt: (text: string, instruction?: string) => `User have give below text \n <text> ${text} </text> \n Transform this text based on below instruction \n <instruction> ${instruction} </instruction> \n`,
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
