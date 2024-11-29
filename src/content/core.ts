export const BUTTON_CONFIG = [
  {
    promptName: "REWRITE",
    label: "Rewrite Text",
    buttonText: "1",
  },
  {
    promptName: "CORRECT_ENGLISH",
    label: "Correct Englist",
    buttonText: "2",
  },
  {
    promptName: "TRANSLATE_TO_ENGLISH",
    label: "Translate to English",
    buttonText: "3",
  },
  {
    promptName: "SUMMARIZE",
    label: "Summarize the text",
    buttonText: "4",
  },
  {
    promptName: "ANSWER_IN_SHORT",
    label: "Answer in short",
    buttonText: "5",
  },
  {
    promptName: "CUSTOM",
    label: "Custom",
    buttonText: "6",
  },
];

export const getPromptName = (buttonText: string): string | undefined => {
  return BUTTON_CONFIG.find((button) => button.buttonText === buttonText)
    ?.promptName;
};
export const validateInput = (
  promptName: string,
  input: string,
  instruction: string,
  onError: (message: string) => void
) => {
  console.log("validation", promptName, input, instruction);

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

export const buildInAiSummarizer = async () => {
  if (self && self.ai && self.ai.summarizer) {
    const options: AISummarizerCreateOptions = {
      sharedContext: "This is a scientific article",
      type: "tl;dr",
      format: "plain-text",
      length: "medium",
    };
    const available = (await self.ai.summarizer.capabilities()).available;
    console.log("buildInAiSummarizer", available);
    if (available === "no") {
      // The Summarizer API isn't usable.
      return;
    }
    if (available === "readily") {
      // The Summarizer API can be used immediately .
      return await self.ai.summarizer.create(options);
    } else {
      let summarizer = await self.ai.summarizer.create(options);
      //TODO: handle download progress
      return summarizer;
    }

  }
};

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
    return;
  }

  if (!validateInput(promptName, input, instruction, setErrorMessage)) {
    return;
  }

  setIsLoading(true); // show loading indicator
  setErrorMessage("");
  if (promptName === "SUMMARIZE") {
    console.log("summarizing with buildIn AI");
    buildInAiSummarizer().then((summarizer) => {
      if (!summarizer) {
        console.log("summarizer not found");
        return;
      }
      summarizer.summarize(input).then((data) => {
        console.log("summarizer data", data);
        onSuccessfulTransform(data);
      }).catch(() => {
        setErrorMessage("Something went wrong. Please try again.");
      }).finally(() => {
        setIsLoading(false);
      });
    }).finally(() => {
      setIsLoading(false);
    })

  }
};
