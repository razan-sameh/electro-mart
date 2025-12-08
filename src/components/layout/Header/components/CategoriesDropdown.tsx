"use client";
import { Suspense, useState } from "react";
import { FaBars } from "react-icons/fa";
import { useTranslations } from "next-intl";
import CategoriesDropdownList from "./CategoriesDropdownList";
import CategoryDropdownSkeleton from "./CategoryDropdownSkeleton";

export default function CategoriesDropdown() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Header");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>(
    t("chooseCategory")
  );

  const baseClasses =
    "flex items-center gap-2 cursor-pointer px-4 py-2 bg-lightGray/40 transition-colors hover:bg-lightGray/70";
  const borderClass = open ? "rounded-ss-md" : "rounded-s-md";

  return (
    <div className="relative">
      {/* Trigger button */}
      <div
        className={`${borderClass} ${baseClasses}`}
        onClick={() => setOpen(!open)}
      >
        <FaBars className="text-icon" />
        <span className="font-medium text-icon">{selectedCategoryName}</span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full w-56 bg-background rounded-b-md shadow-lg z-30">
          <nav className="flex flex-col px-6 py-4 space-y-4 text-icon">
            <Suspense
              fallback={Array.from({ length: 11 }).map((_, i) => (
                <CategoryDropdownSkeleton key={i} />
              ))}
            >
              <CategoriesDropdownList
                setOpen={setOpen}
                setSelectedCategoryName={setSelectedCategoryName}
              />
            </Suspense>
          </nav>
        </div>
      )}
    </div>
  );
}
