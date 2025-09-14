// components/LanguageDropdown.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import IconButton from "./IconButton";
import { useLanguageData } from "@/hooks/useLanguageData";

export default function LanguageDropdown() {
  const { languageOptions } = useLanguageData();
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current language
  const currentLanguage = languageOptions[currentLanguageIndex];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Language selection handler
  const handleLanguageSelect = (index: number) => {
    setCurrentLanguageIndex(index);
    setShowDropdown(false);
    console.log(`Switched to ${languageOptions[index].label}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <IconButton onClick={() => setShowDropdown(!showDropdown)}>
        <div className="flex items-center gap-1">
          {currentLanguage.icon}
          <span className="text-sm font-medium">{currentLanguage.code}</span>
          <FaChevronDown size={10} />
        </div>
      </IconButton>

      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 bg-[#E5E5E5] border border-gray-200 rounded-md shadow-lg z-50 min-w-[120px]">
          {languageOptions.map((option, index) => (
            <button
              key={option.code}
              onClick={() => handleLanguageSelect(index)}
              className={`flex items-center gap-2 w-full px-3 py-2 cursor-pointer text-left hover:bg-gray-100 transition-colors ${
                index === currentLanguageIndex
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700"
              }`}
            >
              {option.icon}
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
