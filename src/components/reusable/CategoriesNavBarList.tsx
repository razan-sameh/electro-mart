// components/CategoriesNavBar.tsx
"use client";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useCategories } from "@/lib/hooks/useCategories";
import { typCategory } from "@/content/types";
import { renderIcon } from "@/content/iconMap";

export default function CategoriesNavBarList() {
  const pathname = usePathname();
  const locale = useLocale();
  const isLanding = pathname === `/${locale}` || pathname === "/";
  const { data: categories } = useCategories();

  return categories.map((item: typCategory) => (
    <Link
      key={item.id}
      href={`/categories/${item.id}`}
      className="flex flex-col items-center justify-center whitespace-nowrap px-3 py-2 text-sm font-medium hover:text-blue-600 transition-colors"
    >
      {isLanding && item.icon && renderIcon(item.icon, 20)}
      <span className="mt-1">{item.name}</span>
    </Link>
  ));
}
