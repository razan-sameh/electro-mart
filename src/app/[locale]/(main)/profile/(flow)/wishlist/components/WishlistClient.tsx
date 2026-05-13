"use client";

import { FiShoppingBag } from "react-icons/fi";
import WishListCard from "./WishListCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useWishlist } from "@/lib/hooks/useWishlist";

export default function WishlistClient() {
  const t = useTranslations("Wishlist");
  const { wishlist, isFetching, removeItem } = useWishlist();
  const hasItems = wishlist?.items?.length! > 0;

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {t("title")}{" "}
            <span className="text-gray-400">({wishlist?.items?.length})</span>
          </h1>
        </div>

        {/* Wishlist Grid */}
        {wishlist && hasItems ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {wishlist?.items?.map((item) => (
              <WishListCard key={item.id} item={item} onRemove={removeItem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <FiShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {t("emptyTitle")}
            </h2>
            <p className="text-gray-500 mb-6">{t("emptyDescription")}</p>
            <Link
              href="/categories"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/80 transition"
            >
              {t("continueShopping")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
