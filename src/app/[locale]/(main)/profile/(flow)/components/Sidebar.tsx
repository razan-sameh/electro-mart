"use client";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { FiUser, FiShoppingBag, FiHeart, FiLogOut } from "react-icons/fi";
import { useTranslations } from "next-intl";

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const t = useTranslations("ProfileSidebar");

  const menuItems = [
    { label: t("myProfile"), href: "/profile", icon: FiUser },
    { label: t("orders"), href: "/profile/orders", icon: FiShoppingBag },
    { label: t("myFavorite"), href: "/profile/wishlist", icon: FiHeart }
  ];

  const pathname = usePathname();
  const normalizedPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  async function handleLogout(): Promise<void> {
    await fetch("/api/auth/logout", { method: "POST" });
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    router.push("/login");
  }

  return (
    <div className="md:py-8 w-60">
      <h2 className="text-lg font-semibold mb-6">
        {t("hi", { name: user?.username || "" })}
      </h2>

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
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-content text-sm hover:text-primary transition"
        >
          <FiLogOut size={18} />
          {t("logout")}
        </button>
      </div>
    </div>
  );
}
