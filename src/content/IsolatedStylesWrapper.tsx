import React from 'react';
import './../tailwind.css';

const IsolatedStylesWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="taip-extension-root">
      <style>{`
        .taip-extension-root,
        .taip-extension-root * {
          border-width: 0;
        }
        .taip-extension-root {
          @apply taip-font-sans taip-text-base taip-leading-normal;
        }
      `}</style>
      {children}
    </div>
  );
};

export default IsolatedStylesWrapper;