import React from 'react';

interface LoadingStateProps {
  label?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ label = 'Loading content...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-400">
      <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
};
