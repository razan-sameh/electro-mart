"use client";
import { useTranslations } from "next-intl";
import { useCategories } from "@/lib/hooks/useCategories";
import { typCategory } from "@/content/types";
import { useRouter } from "@/i18n/navigation";
import { renderIcon } from "@/content/iconMap";

export default function CategoriesDrawerList({
  setMenuOpen,
}: {
  setMenuOpen: (v: boolean) => void;
}) {
  const { data: categories = [] } = useCategories();
  const t = useTranslations("Header");
  const allCategories = [
    { id: 0, name: t("allCategories") },
    ...categories,
  ];
  const router = useRouter();

  const handleSelectCategory = (categoryId: number | null) => {
    const updatedCat = categoryId === 0 ? null : categoryId;
    router.push(updatedCat ? `/categories/${updatedCat}` : `/categories`);
    setMenuOpen(false);
  };

  return allCategories.map((item: typCategory) => (
    <button
      key={item.id}
      className="flex items-center gap-3 hover:text-blue-600 transition-colors"
      onClick={() => handleSelectCategory(item.id)} // ✅ close drawer after click
    >
      {item.icon && renderIcon(item.icon, 20)} {item.name}
    </button>
  ));
}
