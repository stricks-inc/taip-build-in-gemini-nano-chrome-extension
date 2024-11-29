import React, { useCallback, useEffect, useRef, useState } from "react";
import { BUTTON_CONFIG, debounce, getPromptName, handleTranform, validateInput } from "./core";


const Content: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [customInstruction, setCustomInstruction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldListenKeyForShourtcut, setShouldListenKeyForShourtcut] =
    useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function setErrorMessage(message: string) {
    setError(message);
    debounce(() => {
      setError("");
    })();
  }

  // set input text from clipboard
  useEffect(() => {
    if (!isVisible) {
      setOutputText("");
      return;
    }

    // this is to change focus to the container in case user is in some other input box
    containerRef.current?.focus();

    navigator.clipboard
      .readText()
      .then((text) => {
        setInputText(text);
      })
      .catch((err) => {
        console.error("Failed to read clipboard contents: ", err);
        setErrorMessage("Failed to read clipboard contents: ");
      });
  }, [isVisible]);

  // set custom instruction from local storage
  useEffect(() => {
    chrome.storage.local.get(["instruction"], (result) => {
      setCustomInstruction(result.instruction || "");
    });
  }, []);

  // Add listener for the toggle_visibility command
  useEffect(() => {
    const toggleVisibilityListener = (
      request: any,
      sender: any,
      sendResponse: (response?: any) => void
    ) => {
      if (request.command === "toggle_visibility") {
        setIsVisible((prev) => !prev);
      }
    };

    chrome.runtime.onMessage.addListener(toggleVisibilityListener);

    // Clean up listener on component unmount
    return () => {
      chrome.runtime.onMessage.removeListener(toggleVisibilityListener);
    };
  }, []);





  const keyHandler = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isVisible || !shouldListenKeyForShourtcut) {
      console.log(
        "not visible or not focused",
        isVisible,
        shouldListenKeyForShourtcut
      );
      return;
    }

    event.stopPropagation();

    console.log("listenForKeyInputs", event);
    switch (event.key) {
      case "Escape":
        setIsVisible(false);
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
        var promptName = getPromptName(event.key) || "";
        console.log("listenForKeyInputs: state", promptName, inputText, customInstruction);
        var isInputValid = validateInput(promptName, inputText, customInstruction, setErrorMessage);
        if (isInputValid) {
          setShowInfoPopup(true);
          handleTranform(promptName, inputText, customInstruction, isLoading, setIsLoading, true, setShowInfoPopup, setErrorMessage, (text) =>{
            setOutputText(text);
            navigator.clipboard.writeText(text)
            setMessage("Text copied. Press Cmd/Ctrl + V to paste");
            setIsVisible(false);
          })
        }
        break;
      default:
        return;
    }
  }, [isVisible, shouldListenKeyForShourtcut, inputText, customInstruction, setErrorMessage, handleTranform, setShowInfoPopup, setIsVisible]);

  useEffect(() => {
    if (isVisible && shouldListenKeyForShourtcut) {
      console.log("adding event listener");
      document.addEventListener(
        "keydown",
        keyHandler as unknown as EventListener
      );
    }
    return () => {
      console.log("removing event listener");
      document.removeEventListener(
        "keydown",
        keyHandler as unknown as EventListener
      );
    };
  }, [isVisible, shouldListenKeyForShourtcut, keyHandler]);

  if (showInfoPopup) {
    return <InfoPopup isLoading={isLoading} error={error.length > 0} />;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div
      tabIndex={-1} // Make the div focusable
      className="taip-flex taip-flex-col taip-pt-[20px] taip-pb-[20px] taip-px-5 taip-bg-[#EAECEC] taip-rounded-b-2xl taip-outline-none focus:taip-ring-0"
      ref={containerRef}
      onFocus={() => setShouldListenKeyForShourtcut(true)}
      onBlur={() => setShouldListenKeyForShourtcut(false)}
    >
      <div className="taip-flex taip-justify-center taip-tems-center taip-flex-row taip-gap-[4.25px]">
        <textarea
          className="taip-w-full taip-min-w-[100px] taip-h-[100px] taip-p-2 taip-outline-none focus:taip-ring-1 focus:taip-ring-gray-400 focus:taip-border-1 taip-rounded taip-bg-[white] taip-box-border taip-grow-0 taip-shrink taip-font-medium taip-rounded-2xl taip-text-black taip-font-[Quicksand]"
          value={inputText}
          placeholder="Either directly type or just copy text and press the extention shortcut (cmd/ctrl + shift + U)"
          onChange={(e) => {
            setInputText(e.target.value);
            setShouldListenKeyForShourtcut(false);
          }}
        />
        <div className="taip-text-3xl taip-text-[#929CB2] taip-text-bold">→</div>
        <textarea
          className="taip-w-full taip-min-w-[100px] taip-h-[100px] taip-p-2 taip-outline-none focus:taip-ring-1 focus:taip-ring-gray-400	focus:taip-border-1 taip-rounded taip-bg-[white] taip-box-border taip-grow-0 taip-shrink taip-font-medium taip-rounded-2xl taip-text-black taip-font-[Quicksand]"
          value={outputText}
          placeholder={isLoading ? "Generating Response ...": "Tranformed text"}
          onChange={(e) => {
            setOutputText(e.target.value);
            setShouldListenKeyForShourtcut(false);
          }}
        />
        <div className="taip-flex taip-justify-between taip-flex-col taip-h-[100px] taip-box-border taip-pl-2">
          <Button
            className="taip-bg-[#929CB2] taip-mt-1"
            buttonText="Close"
            onClick={() => {
              setIsVisible(false);
            }}
          />
          <Button
            className="taip-bg-[#36cfa7]"
            buttonText="Copy"
            onClick={() => {
              // copy output text to clipboard
              navigator.clipboard.writeText(outputText);
            }}
          />
        </div>
      </div>
      <div className="taip-flex taip-h-[24px] taip-mr-[68px] taip-my-2">
        {error && !isLoading && <div className="taip-text-red-500 taip-text-end taip-w-full">{error}</div>}
        {message && !error && !isLoading && <div className="taip-text-end taip-w-full">{message}</div>}
        </div>
      <div className="taip-flex taip-flex-row taip-justify-start">
        <div className="taip-grid taip-grid-cols-3 taip-gap-y-2 taip-mr-4 taip-min-w-[300px]">
          {BUTTON_CONFIG.map((button) => (
            <div
              key={button.buttonText}
              className="taip-flex taip-flex-col taip-items-center taip-w-[70px] taip-min-h-[60px]"
            >
              <button
                className="taip-w-[36px] taip-h-[36px] taip-bg-[#36CFA7] taip-text-white taip-text-[18px] taip-rounded-xl taip-font-bold"
                onClick={() => handleTranform(button.promptName, inputText, customInstruction, isLoading, setIsLoading, showInfoPopup, setShowInfoPopup, setErrorMessage, (text) =>{
                  setOutputText(text);
                  navigator.clipboard.writeText(text);
                  setMessage("Text copied. Press Cmd/Ctrl + V to paste");
                })}
              >
                {button.buttonText}
              </button>
              <p className="taip-text-[14px] taip-min-h-[24px] taip-text-center taip-text-black taip-font-semibold taip-leading-tight">
                {button.label}
              </p>
            </div>
          ))}
        </div>

        <textarea
          className="taip-w-full taip-p-2 taip-outline-none focus:taip-ring-1 focus:taip-ring-gray-400 focus:taip-border-1 taip-rounded taip-bg-[white] taip-grow-0 taip-shrink taip-font-medium taip-rounded-2xl taip-text-black taip-font-[Quicksand]"
          value={customInstruction}
          onChange={(e) => {
            setCustomInstruction(e.target.value);
            setShouldListenKeyForShourtcut(false);
          }}
          placeholder="Custom instructions (for button 6)"
        />
      </div>
    </div>
  );
};

function InfoPopup({
  isLoading,
  error,
}: {
  isLoading: boolean;
  error: boolean;
}) {
  return (
    <div
      className={`taip-flex taip-flex-col taip-items-center taip-justify-center taip-h-[36px] taip-w-full ${error ? "taip-bg-red-500" : "taip-bg-[#36CFA7]"} taip-text-center taip-text-[18px] taip-text-white taip-rounded-b-2xl`}
    >
      {isLoading && <p> Tranforming text...</p>}
      {!isLoading && !error && (
        <p>Text transformed, press Cmd/Ctrl + V to paste</p>
      )}
      {!isLoading && error && <p> Transform failed, please try again </p>}
    </div>
  );
}

function Button({
  className,
  buttonText,
  onClick,
}: {
  className: string;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`${className} taip-box-border taip-h-[36px] taip-w-[60px] taip-rounded-[12px] taip-text-white taip-text-[12px] taip-font-bold`}
      onClick={onClick}
    >
      {buttonText}
    </button>
  );
}

export default Content;
