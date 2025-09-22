"use client";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { useCategories } from "@/lib/hooks/useCategories";
import { useTranslations } from "next-intl";

export default function ProductsDropdown() {
  const [open, setOpen] = useState(false);
  const { data: categories = [], isLoading, error } = useCategories();
  const t = useTranslations("Header");

  // Base classes that don't change
  const baseClasses = "flex items-center gap-2 cursor-pointer px-4 py-2 bg-lightGray/40 transition-colors hover:bg-lightGray/70";
  
  // Dynamic border radius class
  const borderClass = open ? "rounded-ss-md" : "rounded-s-md";

  return (
    <div className="relative">
      {/* Trigger button */}
      <div
        onClick={() => setOpen(!open)}
        className={`${borderClass} ${baseClasses}`}
      >
        <FaBars className="text-icon" />
        <span className="font-medium text-icon">{t("products")}</span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full w-56 bg-background rounded-b-md shadow-lg z-30">
          <nav className="flex flex-col px-6 py-4 space-y-4 text-icon">
            {categories.map((item) => (
              <button
                key={item.id}
                className="text-left hover:text-blue-600 transition-colors cursor-pointer"
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}