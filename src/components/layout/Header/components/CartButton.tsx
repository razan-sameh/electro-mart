"use client";

import { useState, useRef, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import IconButton from "./IconButton";
import CartDropdown from "./CartDropdown";
import { useCartStore } from "@/stores/cartStore";

export default function CartButton() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Get items from Zustand
  const items = useCartStore((state) => state.items);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="relative" ref={buttonRef}>
      <IconButton onClick={() => setOpen(!open)}>
        <FaShoppingCart size={20} />
      </IconButton>

      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}

      {open && <CartDropdown onClose={() => setOpen(false)} />}
    </div>
  );
}
