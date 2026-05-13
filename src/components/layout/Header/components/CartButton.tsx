"use client";

import { useState, useRef, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import IconButton from "./IconButton";
import CartDropdown from "./CartDropdown";
import { useCart } from "@/lib/hooks/useCart";

export default function CartButton() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  // ✅ Use unified cart (works for both guest & logged-in users)
  const {cart, isLoading } = useCart();

  // ✅ Calculate total quantity
  const itemCount = cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

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

  return (
    <div className="relative" ref={buttonRef}>
      <IconButton onClick={() => setOpen(!open)}>
        <FaShoppingCart size={20} />
      </IconButton>

      {/* ✅ Show cart count if not loading */}
      {!isLoading && itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}

      {open && <CartDropdown onClose={() => setOpen(false)} />}
    </div>
  );
}
