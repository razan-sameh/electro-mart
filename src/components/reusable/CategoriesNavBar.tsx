// components/CategoriesNavBar.tsx
"use client";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import CategoriesNavBarList from "./CategoriesNavBarList";
import { Suspense } from "react";
import CategoryNavBarSkeleton from "../ui/CategoryNavBarSkeleton";

interface CategoriesNavBarProps {
  absolute?: boolean; // if true → overlay mode
}

export default function CategoriesNavBar({
  absolute = false,
}: CategoriesNavBarProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const isLanding = pathname === `/${locale}` || pathname === "/";
  // ✅ Dynamic container classes based on pathname
  const containerClasses = isLanding
    ? "rounded-lg shadow-md" // full rounded when on homepage
    : "rounded-b-lg border-t border-gray-200"; // only bottom rounded when NOT homepage

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
          <Suspense fallback={<CategoryNavBarSkeleton />}>
            <CategoriesNavBarList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
