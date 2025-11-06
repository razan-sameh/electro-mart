import React from "react";

// Tab Component
interface TabProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

export const Tab: React.FC<TabProps> = ({
  label,
  count,
  isActive,
  onClick,
}) => (
  <li
    onClick={onClick}
    className={`flex-1 min-w-max text-center pb-3 px-3 flex items-center justify-center gap-1 border-b-2 transition-colors duration-200 
      ${
        isActive
          ? "text-primary border-primary"
          : "text-gray-500 border-transparent hover:text-primary"
      }`}
  >
    {label} {count}
  </li>
);
