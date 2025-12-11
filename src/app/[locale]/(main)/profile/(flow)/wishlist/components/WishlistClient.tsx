"use client";

import { FiShoppingBag } from "react-icons/fi";
import ProductCard from "./ProductCard";
import { useUnifiedWishlist } from "@/hooks/useUnifiedWishlist";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function WishlistClient() {
  const { wishlistItems, isLoading, removeItem } = useUnifiedWishlist();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner/>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            Wishlist {' '}
            <span className="text-gray-400">({wishlistItems.length})</span>
          </h1>
        </div>

        {/* Wishlist Grid */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <ProductCard
                key={item.documentId}
                item={item}
                onRemove={removeItem}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <FiShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-6">Save items you love for later</p>
            <a
              href="/categories"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/80 transition"
            >
              Continue Shopping
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
