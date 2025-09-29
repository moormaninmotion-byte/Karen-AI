
import React from 'react';

interface ResponseDisplayProps {
  title: string;
  content: string;
  icon: React.ReactNode;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ title, content, icon }) => {
  if (!content) return null;

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-2xl flex flex-col h-full">
      <div className="p-4 border-b border-gray-700 flex items-center space-x-3">
        {icon}
        <h2 className="text-xl font-bold text-gray-200">{title}</h2>
      </div>
      <div className="p-6 flex-grow overflow-y-auto">
        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
};

export default ResponseDisplay;
