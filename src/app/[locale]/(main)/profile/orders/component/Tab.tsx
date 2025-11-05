import React from 'react';

// Tab Component
interface TabProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

export const Tab: React.FC<TabProps> = ({ label, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`pb-3 px-1 relative transition-colors ${
      isActive
        ? 'text-blue-600 font-medium'
        : 'text-gray-600 hover:text-gray-900'
    }`}
  >
    {label} {count}
    {isActive && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
    )}
  </button>
);
