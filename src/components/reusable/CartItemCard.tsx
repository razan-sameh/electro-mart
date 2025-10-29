"use client";
import React from "react";

interface CartItemCardProps {
  item: any;
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const price = item?.product?.price ?? 0;
  const quantity = item?.quantity ?? 0;

  return (
    <div
      key={`${item.id}-${item.selectedColor?.id || "default"}`}
      className="flex items-center justify-between border border-lightGray/60 rounded-lg p-3 sm:p-4 hover:shadow-sm transition"
    >
      <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
        <img
          src={item.product.imagesUrl[0]}
          alt={item.product.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex flex-col min-w-0 flex-1">
          <p className="font-medium text-sm sm:text-base truncate">
            {item.product.name}
          </p>
          {item.selectedColor && (
            <p className="text-xs sm:text-sm">{item.selectedColor.name}</p>
          )}
          <p className="text-xs sm:text-sm">×{quantity}</p>
        </div>
      </div>
      <p className="font-semibold text-sm sm:text-base ml-2 flex-shrink-0">
        € {price * quantity}
      </p>
    </div>
  );
}
