// components/CategoriesNavBar.tsx
"use client";
import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useCategories } from "@/lib/hooks/useCategories";
import { typCategory } from "@/content/types";
import { renderIcon } from "@/content/iconMap";

interface CategoriesNavBarProps {
  absolute?: boolean; // if true → overlay mode
}

export default function CategoriesNavBar({
  absolute = false,
}: CategoriesNavBarProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const isLanding = pathname === `/${locale}` || pathname === "/";
  const { data: categories } = useCategories();
  // ✅ Dynamic container classes based on pathname
  const containerClasses = isLanding
    ? "rounded-lg shadow-md" // full rounded when on homepage
    : "rounded-b-lg border-t border-gray-200"; // only bottom rounded when NOT homepage
  const router = useRouter();

  return (
    <div
      className={
        absolute ? "absolute bottom-6 left-0 right-0 z-20 px-4" : "relative"
      }
    >
      <div
        className={`relative mx-auto  md:px-12 ${containerClasses} ${
          isLanding ? "container px-4 bg-background/60" : "bg-background"
        }`}
      >
        <div className="flex flex-wrap justify-between items-center py-2 overflow-x-auto ">
          {categories.map((item: typCategory) => (
            <Link
              key={item.id}
              href={`/categories/${item.id}`}
              className="flex flex-col items-center justify-center whitespace-nowrap px-3 py-2 text-sm font-medium hover:text-blue-600 transition-colors"
            >
              {isLanding && item.icon && renderIcon(item.icon, 20)}
              <span className="mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
