// components/Header/ProductsDropdown.tsx
"use client";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { useMenuData } from "@/hooks/useMenuData";
import { Link } from "@/i18n/navigation";

export default function ProductsDropdown() {
  const [open, setOpen] = useState(false);
  const { getMenuItemsLabelsOnly, handleItemClick } = useMenuData();
  
  // Get items without icons for dropdown
  const items = getMenuItemsLabelsOnly();

  const handleItemClickWithClose = (item: { id: string; label: string; href: string }) => {
    // Convert to MenuItem format and handle click
    handleItemClick({ ...item, icon: null });
    setOpen(false); // Close dropdown after click
  };

  return (
    <div className="relative">
      {/* Trigger button */}
      <div
        onClick={() => setOpen(!open)}
        className={`${
          open ? "rounded-tl-md" : "rounded-l-md"
        } flex items-center gap-2 cursor-pointer px-4 py-2 bg-[#E5E5E5] transition-colors hover:bg-gray-300`}
      >
        <FaBars className="text-gray-700" />
        <span className="font-medium text-gray-700">Products</span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full w-56 bg-[#E5E5E5] rounded-b-md shadow-lg z-30">
          <nav className="flex flex-col px-6 py-4 space-y-4 text-gray-800">
            {items.map((item) => (
              <Link 
                key={item.id} 
                href={item.href}
                onClick={() => handleItemClickWithClose(item)}
                className="hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}