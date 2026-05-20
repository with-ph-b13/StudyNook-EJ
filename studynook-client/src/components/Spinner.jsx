import React from 'react';

const Spinner = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-4',
    large: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div
        className={`${sizeClasses[size]} border-slate-200 border-t-indigo-600 dark:border-slate-800 dark:border-t-indigo-400 rounded-full animate-spin`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse font-sans">
        Finding your nook...
      </p>
    </div>
  );
};

export default Spinner;
