"use client";
import { FaTimes } from "react-icons/fa";
import { ReactNode } from "react";
import { useLocale } from "next-intl";

interface MobileDrawerProps {
  setMenuOpen: (v: boolean) => void;
  isOpen: boolean;
  children: ReactNode;
}

export default function MobileDrawer({
  setMenuOpen,
  isOpen,
  children,
}: MobileDrawerProps) {
  const locale = useLocale();

  return (
    <div
      className={`fixed inset-0 z-50 transition-all ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      {/* Background Overlay */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`absolute top-0 w-72 bg-background shadow-lg p-6 flex flex-col transform transition-transform duration-300 ${
          locale === "ar"
            ? `${isOpen ? "translate-x-0 right-0" : "translate-x-full right-0"}`
            : `${isOpen ? "translate-x-0 left-0" : "-translate-x-full left-0"}`
        }`}
      >
        <div className="flex items-center justify-end">
          <button onClick={() => setMenuOpen(false)}>
            <FaTimes size={22} className="text-icon" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
