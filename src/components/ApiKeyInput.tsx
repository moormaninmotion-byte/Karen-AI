import React, { useState } from 'react';
import { KeyIcon } from './Icons';

/**
 * Props for the ApiKeyInput component.
 */
interface ApiKeyInputProps {
  onSetApiKey: (key: string) => void;
}

/**
 * A form component that prompts the user to enter their Gemini API key.
 * The key is stored in local storage for persistence.
 */
const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSetApiKey }) => {
  const [keyValue, setKeyValue] = useState('');

  /**
   * Handles the form submission.
   * It trims the key and calls the onSetApiKey callback.
   */
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (keyValue.trim()) {
      onSetApiKey(keyValue.trim());
      setKeyValue(''); // Clear the input field after submission
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 w-full max-w-md mx-auto shadow-xl">
      <div className="flex items-center mb-4">
        <KeyIcon />
        <h2 className="text-xl font-bold ml-3">Set Gemini API Key</h2>
      </div>
      <p className="text-gray-400 mb-4">
        An API key is required to use this application. Your key is saved in your browser's local storage and is never sent to our servers.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="password"
            value={keyValue}
            onChange={(e) => setKeyValue(e.target.value)}
            placeholder="Enter your Gemini API key"
            className="w-full p-3 pr-4 bg-gray-900 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            aria-label="Gemini API Key"
          />
        </div>
        <button
          type="submit"
          disabled={!keyValue.trim()}
          className="mt-4 w-full flex items-center justify-center p-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
};

export default ApiKeyInput;
