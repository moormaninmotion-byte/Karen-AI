import React from 'react';
import Header from './Header';
import ApiKeyInput from './ApiKeyInput';

/**
 * Props for the ApiKeySetup component.
 */
interface ApiKeySetupProps {
  onSetApiKey: (key: string) => void;
  error: string;
}

/**
 * A component that renders the initial screen for users to enter their API key.
 * It includes the header, a branding image, the API key input form, and an error display area.
 */
const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onSetApiKey, error }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto text-center">
        <Header />
        <div className="flex justify-center my-8">
          <img
            src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGJmaXh0a3B0YnVnZjNqMDljNHdoa3h3djIyMGw2MnFtbzNiZ2FscCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l4pT9M7xTuvBzwtGg/giphy.gif"
            alt="A woman demanding to speak to the manager"
            className="rounded-lg shadow-xl w-full max-w-md"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
      <div className="w-full max-w-6xl mx-auto mt-auto">
        <ApiKeyInput onSetApiKey={onSetApiKey} />
        {error && (
          <div className="mt-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center max-w-md mx-auto">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiKeySetup;
