"use client";
import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { useCategories } from "@/lib/hooks/useCategories";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
interface Props {
  setOpen: (v: boolean) => void;
  setSelectedCategoryName: (v: string) => void;
}
export default function CategoriesDropdownList({
  setOpen,
  setSelectedCategoryName,
}: Props) {
  const { data: categories = [] } = useCategories();
  const t = useTranslations("Header");
  const router = useRouter();
  const searchParams = useSearchParams();

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

  return allCategories.map((item) => (
    <button
      key={item.id}
      className="text-left hover:text-blue-600 transition-colors cursor-pointer"
      onClick={() => handleSelectCategory(item.id)}
    >
      {item.name}
    </button>
  ));
}
