// components/CategoriesNavBar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMenuData } from "@/hooks/useMenuData";

interface CategoriesNavBarProps {
  absolute?: boolean; // if true → overlay mode
}

export default function CategoriesNavBar({
  absolute = false,
}: CategoriesNavBarProps) {
  const pathname = usePathname();
  const { getMenuItemsWithIcons, handleItemClick, isActiveItem } = useMenuData();
  
  const bgColor = pathname === "/" ? "rgba(255,255,255,0.7)" : "white";
  
  // Get items with icons only if on homepage
  const items = getMenuItemsWithIcons(pathname === "/");

  // ✅ Dynamic container classes based on pathname
  const containerClasses =
    pathname === "/"
      ? "rounded-lg shadow-md" // full rounded when on homepage
      : "rounded-b-lg border-t border-gray-200"; // only bottom rounded when NOT homepage

  return (
    <div
      className={
        absolute ? "absolute bottom-6 left-0 right-0 z-20 px-4" : "relative"
      }
    >
      <div
        className={`relative max-w-7xl mx-auto px-4 md:px-12 ${containerClasses}`}
        style={{ backgroundColor: bgColor }}
      >
        <div className="flex flex-wrap justify-between items-center py-2 overflow-x-auto">
          {items.map((item) => {
            const isActive = isActiveItem(pathname, item.id);
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center justify-center whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? "text-blue-600" 
                    : "text-gray-700 hover:text-blue-600"
                }`}
                onClick={() => handleItemClick(item)}
              >
                {pathname === "/" && item.icon && (
                  <div className="text-lg">{item.icon}</div>
                )}
                <span className="mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}