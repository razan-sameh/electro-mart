"use client";
import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { useCategories } from "@/lib/hooks/useCategories";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

export default function ProductsDropdown() {
  const [open, setOpen] = useState(false);
  const { data: categories = [] } = useCategories();
  const t = useTranslations("Header");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>(
    t("products")
  );
  const allCategories = [
    { id: "all", name: t("allCategories") },
    ...categories,
  ];

  const handleSelectCategory = (categoryId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    const q = params.get("q"); // keep search if exists
    const updatedCat = categoryId === "all" ? null : categoryId;
    const selected = allCategories.find(
      (cat) => cat.id === (updatedCat ?? "all")
    );
    setSelectedCategoryName(selected?.name || t("products"));
    router.push(
      updatedCat
        ? `/categories/${updatedCat}${q ? `?q=${q}` : ""}`
        : `/categories${q ? `?q=${q}` : ""}`
    );
    setOpen(false);
  };

  const baseClasses =
    "flex items-center gap-2 cursor-pointer px-4 py-2 bg-lightGray/40 transition-colors hover:bg-lightGray/70";
  const borderClass = open ? "rounded-ss-md" : "rounded-s-md";

  // const handleSelectCategory = (id: string) => {
  //   // Set null for "all" to indicate all categories
  //   setCategoryId(id === "all" ? null : id);
  //   setOpen(false);
  // };

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
            {allCategories.map((item) => (
              <button
                key={item.id}
                className="text-left hover:text-blue-600 transition-colors cursor-pointer"
                onClick={() => handleSelectCategory(item.id)}
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
