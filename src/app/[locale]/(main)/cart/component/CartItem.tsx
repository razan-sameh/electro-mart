"use client";

import ProductPrice from "@/components/reusable/ProductPrice";
import { typCartItem } from "@/content/types";
import { useUnifiedCart } from "@/hooks/useUnifiedCart";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface Props {
  item: typCartItem;
}

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeItem } = useUnifiedCart();
  const [loadingItemId, setLoadingItemId] = useState<number | null>(null);
    const t = useTranslations("Cart");

  const handleUpdateQuantity = async (newQuantity: number) => {
    try {
      setLoadingItemId(item.id);
      await updateQuantity(item, newQuantity);
    } finally {
      setLoadingItemId(null);
    }
  };

  return (
    <div className="max-w-3xl w-full border border-lightGray/60 rounded-lg px-6 bg-background min-h-[317px] flex">
      <div className="flex flex-col sm:flex-row gap-6 flex-1">
        {/* Product Image */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <Link
            href={`/products/${item.product.documentId}`} // adjust route to match your product page path
            className="flex-shrink-0 flex items-center justify-center"
          >
            <img
              src={item.product.imagesUrl[0]}
              alt={item.product.name}
              className="w-48 h-32 object-contain rounded-md hover:opacity-90 transition"
            />
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-center mb-4">
          {/* Top Section: Name + Trash */}
          <div className="flex items-start justify-between">
            <h2 className="font-semibold text-base text-content line-clamp-2 pr-2">
              {item.product.name}
            </h2>
            <button
              onClick={() => removeItem(item)}
              className="text-gray-400 hover:text-red-500 ml-2"
            >
              <FaTrash size={18} />
            </button>
          </div>

          {/* Brand + Color */}
          <div className="space-y-1 mt-2">
            <p className="text-sm text-gray-500">
              {t("brand")}: {item.product.brand.name}
            </p>
            {item.selectedColor && (
              <p className="text-sm text-gray-500">
                {t("color")}: {item.selectedColor.name}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="mt-3">
            <ProductPrice item={item.product} />
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3 mt-5 border border-lightGray rounded-xl w-fit px-2 py-1 h-[42px] min-w-[120px] justify-center">
            {loadingItemId === item.id ? (
              // ✅ Keep same layout space using flexbox
              <div className="flex items-center justify-center w-full h-full">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Decrease Button */}
                <button
                  onClick={() =>
                    handleUpdateQuantity(Math.max(item.quantity - 1, 1))
                  }
                  disabled={item.quantity === 1 || loadingItemId === item.id}
                  className={`w-8 h-8 flex items-center justify-center text-lg rounded transition-colors
          ${
            item.quantity === 1
              ? "text-gray-400 cursor-not-allowed"
              : "hover:text-primary"
          }`}
                >
                  –
                </button>

                {/* Quantity */}
                <span className="min-w-[24px] text-center">
                  {item.quantity}
                </span>

                {/* Increase Button */}
                <button
                  onClick={() => handleUpdateQuantity(item.quantity + 1)}
                  disabled={loadingItemId === item.id}
                  className="w-8 h-8 flex items-center justify-center text-lg hover:text-primary"
                >
                  +
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
