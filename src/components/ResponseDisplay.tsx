import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './Icons';

/**
 * Props for the ResponseDisplay component.
 */
interface ResponseDisplayProps {
  title: string;
  content: string;
  icon: React.ReactNode;
}

/**
 * A component that displays a single AI-generated response in a styled card.
 * It includes a title, an icon, a copy button, and the main content.
 */
const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ title, content, icon }) => {
  const [isCopied, setIsCopied] = useState(false);

  // Don't render the component if there's no content.
  if (!content) {
    return null;
  }

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-2xl flex flex-col h-full">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon}
          <h2 className="text-xl font-bold text-gray-200">{title}</h2>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center px-3 py-1 text-xs rounded-md transition-colors ${
            isCopied
              ? 'bg-green-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          aria-label="Copy response to clipboard"
        >
          {isCopied ? <CheckIcon /> : <CopyIcon />}
          <span className="ml-1.5">{isCopied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      {/* Card Body */}
      <div className="p-6 flex-grow overflow-y-auto">
        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
};

export default ResponseDisplay;
