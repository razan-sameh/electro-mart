"use client";

import { typCartItem } from "@/content/types";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useCart } from "@/lib/hooks/useCart";

interface Props {
  item: typCartItem;
}

export default function CartItem({ item }: Props) {
  const { updateItem, removeItem } = useCart();
  const t = useTranslations("Cart");
  const subtotal = item?.variant?.price * item?.quantity;
  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return;

    await updateItem({
      itemId: item.id,
      quantity: newQuantity,
    });
  };

  const imageUrl = item.product.imagesUrl?.[0]?.url ?? "/placeholder.png";
  const totalPrice = item.unitPrice * item.quantity;

  return (
    <div className="max-w-3xl w-full border border-lightGray/60 rounded-lg px-6 bg-background min-h-[317px] flex">
      <div className="flex flex-col sm:flex-row gap-6 flex-1">
        {/* Product Image */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <Link
            href={`/products/${item.product.id}`}
            className="flex items-center justify-center"
          >
            <img
              src={imageUrl}
              alt={item.product.name}
              className="w-48 h-32 object-contain rounded-md hover:opacity-90 transition"
            />
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-center mb-4">
          {/* Name + Remove */}
          <div className="flex items-start justify-between">
            <h2 className="font-semibold text-base text-content line-clamp-2 pr-2">
              {item.product.name}
            </h2>

            <button
              onClick={() => removeItem(item.id)}
              className="text-gray-400 hover:text-red-500 ml-2"
            >
              <FaTrash size={18} />
            </button>
          </div>

          {/* Brand */}
          <div className="space-y-1 mt-2">
            <p className="text-sm text-gray-500">
              {t("brand")}: {item.product.brand.name}
            </p>
          </div>

          {/* Variant Attributes (color, storage, size...) */}
          {item.variant.attributes?.length > 0 && (
            <div className="my-2 text-sm text-gray-500">
              {item.variant.attributes.map((attr) => (
                <p key={attr.id}>
                  {attr.attribute}: {attr.value}
                </p>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex gap-2 items-center mb-2 flex-wrap mt-3 ">
            {item?.variant?.offer?.title != "" && (
              <span className="text-gray-400 line-through">
                E£ {subtotal?.toFixed(2)}
              </span>
            )}
            <span className="text-lg font-bold text-secondary">
              E£ {totalPrice?.toFixed(2)}
            </span>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3 mt-5 border border-lightGray rounded-xl w-fit px-2 py-1 h-[42px] min-w-[120px] justify-center">
            <button
              onClick={() =>
                handleUpdateQuantity(Math.max(item.quantity - 1, 1))
              }
              disabled={item.quantity === 1}
              className={`w-8 h-8 flex items-center justify-center text-lg rounded transition-colors
                    ${
                      item.quantity === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "hover:text-primary"
                    }`}
            >
              –
            </button>

            <span className="min-w-[24px] text-center">{item.quantity}</span>

            <button
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-lg hover:text-primary"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
