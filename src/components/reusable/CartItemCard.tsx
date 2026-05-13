"use client";

import { typCartItem } from "@/content/types";

interface CartItemCardProps {
  item: typCartItem;
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const { product, variant, quantity, unitPrice } = item;

  const imageUrl = product?.imagesUrl?.[0]?.url ?? "/placeholder.png";
  const totalPrice = unitPrice * quantity;

  return (
    <div className="flex items-center justify-between border border-lightGray/60 rounded-lg p-3 sm:p-4 hover:shadow-sm transition">
      {/* Product Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <img
          src={imageUrl}
          alt={product?.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0"
        />

        <div className="flex flex-col min-w-0">
          <p className="font-medium text-sm sm:text-base truncate">
            {product?.name}
          </p>

          {/* Variant attributes (color, storage, size, etc.) */}
          {variant?.attributes?.length > 0 && (
            <div className="text-xs sm:text-sm text-muted-foreground">
              {variant.attributes.map((attr) => (
                <p key={attr?.id} className="mr-2">
                  {attr?.attribute}: {attr?.value}
                </p>
              ))}
            </div>
          )}

          <p className="text-xs sm:text-sm text-muted-foreground">
            ×{quantity}
          </p>
        </div>
      </div>

      {/* Price */}
      <p className="font-semibold text-sm sm:text-base ml-2 flex-shrink-0">
        E£ {totalPrice.toFixed(2)}
      </p>
    </div>
  );
}
