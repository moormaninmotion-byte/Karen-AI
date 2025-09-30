import React from 'react';
import { EyeIcon, ZapIcon } from './Icons';

/**
 * Props for the UsageStats component.
 */
interface UsageStatsProps {
  visits: number;
  runs: number;
}

/**
 * A footer component that displays application usage statistics,
 * including total page visits and total queries run.
 */
const UsageStats: React.FC<UsageStatsProps> = ({ visits, runs }) => {
  return (
    <footer className="w-full max-w-6xl mx-auto mt-auto pt-8 pb-4">
      <div className="flex justify-center items-center space-x-6 text-xs text-gray-500 border-t border-gray-800 pt-4">
        <div className="flex items-center" title="Total times the page has been loaded">
          <EyeIcon />
          <span className="ml-1.5">Page Visits: {visits}</span>
        </div>
        <div className="flex items-center" title="Total queries successfully submitted">
          <ZapIcon />
          <span className="ml-1.5">Queries Run: {runs}</span>
        </div>
      </div>
    </footer>
  );
};

export default UsageStats;
