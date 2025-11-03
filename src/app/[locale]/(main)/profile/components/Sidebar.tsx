"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiMapPin,
  FiLogOut,
} from "react-icons/fi";

const menuItems = [
  { label: "My profile", href: "/profile", icon: FiUser },
  { label: "Orders", href: "/profile/orders", icon: FiShoppingBag },
  { label: "My favorite", href: "/profile/favorites", icon: FiHeart },
  { label: "Addresses", href: "/profile/addresses", icon: FiMapPin },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const normalizedPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");

  return (
    <div className="py-8 w-60">
      <h2 className="text-lg font-semibold mb-6">Hi, Emma</h2>
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = normalizedPath === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-md py-2 text-sm font-medium transition ${
                active ? "text-primary" : "text-content hover:text-primary"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 border-t border-gray-300 pt-4">
        <button className="flex items-center gap-3 text-content text-sm hover:text-primary transition">
          <FiLogOut size={18} />
          Log out
        </button>
      </div>
    </div>
  );
}
