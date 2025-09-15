"use client";
import { FaChevronDown } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import IconButton from "./IconButton";
import { useLanguage } from "@/hooks/useLanguage";

export default function LanguageDropdown() {
  const { languageOptions, currentLanguage, changeLanguage, locale } =
    useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <IconButton onClick={() => setShowDropdown(!showDropdown)}>
        <div className="flex items-center gap-1">
          {currentLanguage.icon}
          <span className="text-sm font-medium">{currentLanguage.displayCode}</span>
          <FaChevronDown size={10} />
        </div>
      </IconButton>

      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 bg-[#E5E5E5] rounded-md shadow-lg z-50 min-w-[120px]">
          {languageOptions.map((option) => (
            <button
              key={option.code}
              onClick={() => {
                changeLanguage(option.code.toLowerCase());
                setShowDropdown(false);
              }}
              className={`flex items-center gap-2 w-full px-3 py-2 cursor-pointer text-start hover:bg-gray-100 transition-colors ${
                option.code.toLowerCase() === locale
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
