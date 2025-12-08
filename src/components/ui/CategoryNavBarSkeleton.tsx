"use client";

import { usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function CategoryNavBarListSkeleton() {
  const pathname = usePathname();
  const locale = useLocale();
  const isLanding = pathname === `/${locale}` || pathname === "/";
  return Array.from({ length: 11 }).map((_, i) => (
    <div
      key={i}
      className="flex flex-col items-center justify-center w-16 h-16 rounded-md animate-pulse"
    >
      {/* Icon placeholder */}
      {isLanding && <div className="w-6 h-6 bg-gray-300 rounded-full mb-1" />}

      {/* Text placeholder */}
      <div className="h-3 w-8 bg-gray-200 rounded" />
    </div>
  ));
}
