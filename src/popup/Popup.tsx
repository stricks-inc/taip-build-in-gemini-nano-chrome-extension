import React, { useEffect, useState } from "react";

const Popup: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [aiAvailable, setAiAvailable] = useState<any>(null);
  const [languageModelAvailable, setLanguageModelAvailable] = useState<string | null>(null);
  useEffect(() => {
    chrome.runtime.sendMessage({ command: "get_popup_state" }, (response) => {
      if (response && response.data) {
        setEmail(response.data.email);
        setAiAvailable(response.data.available);
      }
    });
  }, []);

  useEffect(() => {
    chrome.runtime.sendMessage({ command: "get_capabilities" }, (response) => {
      const available = response.capabilities.languageModel;
      if (available === "no" || available=== null) {
        setLanguageModelAvailable("Language model not available");
      } else if (available=== "after-download") {
        setLanguageModelAvailable("Language model is downloading...");
      } else if (available === "readily") {
        setLanguageModelAvailable("Language model is ready");
      }
    });
  }, []);

  const handleEmailSubmit = (email: string) => {
    // validate email

    if (!email) {
      setErrorMessage("Please enter your email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Please enter a valid email");
      return;
    }
    setErrorMessage("");

    chrome.runtime.sendMessage({ command: "save_email", data: { email } });
    setEmail(email);
  };
  const isAiAvailable = aiAvailable?.isLanguageModelAvailable || aiAvailable?.isRewriterAvailable || aiAvailable?.isSummarizerAvailable;

  return <div className=" taip-h-[400px] taip-w-[360px] taip-bg-gray-100">
    {!isAiAvailable && <AICapabilitiesEnabledStep aiAvailable={aiAvailable} />}
    {isAiAvailable && email && <HowItWorks message={languageModelAvailable} />}
    {isAiAvailable && !email && <LoginPage errorMessage={errorMessage} onSubmit={handleEmailSubmit} />}
  </div>
};

function AICapabilitiesEnabledStep({aiAvailable}: {aiAvailable: any}) {
  const handleEnableAI = (flag: string) => {
    chrome.tabs.create({ url: `chrome://flags/${flag}` });
  };
  
  //TODO: correct this flag name

  return <div className="taip-flex taip-flex-col taip-justify-center taip-items-center taip-h-full taip-m-4">
    <h1 className="taip-text-2xl taip-font-bold taip-mb-8">Your browser does not support AI capabilities</h1>
    <p className="taip-text-sm taip-mb-8">Please enable AI capabilities in your browser settings.</p>
    <button 
      onClick={() => handleEnableAI('Experimental Web Platform features')}
      className="taip-text-blue-500 taip-underline"
    >
      Enable AI capabilities
    </button>
  </div>;
}

function HowItWorks({message}: {message: string | null}) {
  return (
    <div className="taip-flex taip-flex-col taip-justify-center taip-items-center taip-h-full">
      <img
        src={chrome.runtime.getURL("images/icon-128.png")}
        alt="icon"
        className="taip-w-16 taip-h-16 taip-mb-4 taip-mt-2"
      />
      <h1 className="taip-text-2xl taip-font-bold taip-mb-2">How it works</h1>

      <p className="taip-text-sm taip-mb-2">{message}</p>
      <div className="taip-mb-6 taip-text-sm taip-m-4">
        <p className="taip-mb-2">1. Copy the text to transform (cmd/ctrl + c).</p>
        <p className="taip-mb-2">2. Press cmd/ctrl + shift + U to activate extention.</p>
        <p className="taip-mb-2">3. Press/select number keys from the given options (1 -6).</p>
        <p className="taip-mb-2">4. Transformed text copied to clipboard, press cmd/ctrl + v to paste.</p>
      </div>
    </div>
  );
}

function LoginPage({
  errorMessage,
  onSubmit,
}: {
  errorMessage: string | undefined;
  onSubmit: (value: string) => void;
}) {
  const [email, setEmail] = useState("");

  return (
    <div className="taip-flex taip-flex-col taip-justify-center taip-items-center taip-h-full">
      <img
        src={chrome.runtime.getURL("images/icon-128.png")}
        alt="icon"
        className="taip-w-16 taip-h-16 taip-mb-4"
      />
      <h1 className="taip-text-2xl taip-font-bold taip-mb-10">Your Email</h1>
      <input
        id="emailInput"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        placeholder="Enter your email here"
        className="taip-px-4 taip-py-2 taip-w-64 taip-text-sm taip-bg-white taip-rounded-md taip-border-gray-300 focus:taip-outline-none focus:taip-ring-2 focus:taip-ring-blue-500"
        aria-label="Enter your email"
      />
      {errorMessage && <div className="taip-text-red-500">{errorMessage}</div>}
      <button
        className="taip-mt-8 taip-px-6 taip-py-2 taip-bg-blue-500 taip-text-white taip-rounded-md hover:taip-bg-blue-600 focus:taip-outline-none focus:taip-ring-2 focus:taip-ring-blue-500 focus:taip-ring-offset-2"
        onClick={() => {
          onSubmit(email);
        }}
      >
        Next
      </button>
    </div>
  );
}

export default Popup;
