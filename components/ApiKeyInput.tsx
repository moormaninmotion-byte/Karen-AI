
import React, { useState } from 'react';
import { KeyIcon } from './Icons';

interface ApiKeyInputProps {
  onSetApiKey: (key: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSetApiKey }) => {
  const [key, setKey] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSetApiKey(key.trim());
      setKey(''); // Clear input after saving
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 w-full max-w-md mx-auto shadow-xl">
      <div className="flex items-center mb-4">
        <KeyIcon />
        <h2 className="text-xl font-bold ml-3">Set Your Gemini API Key</h2>
      </div>
      <p className="text-gray-400 mb-4">
        Your API key is required to use this app. It is stored in your browser's local storage and is not sent to any servers besides Google's.
      </p>
      <form onSubmit={handleSave}>
        <div className="relative">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter your API key here"
            className="w-full p-3 pr-4 bg-gray-900 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            aria-label="Gemini API Key"
          />
        </div>
        <button
          type="submit"
          disabled={!key.trim()}
          className="mt-4 w-full flex items-center justify-center p-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-colors"
        >
          <span className="ml-2">Save and Continue</span>
        </button>
      </form>
    </div>
  );
};

export default ApiKeyInput;
