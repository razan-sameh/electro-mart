"use client";

import ProductPrice from "@/components/reusable/ProductPrice";
import { typCartItem } from "@/content/types";
import { useCartStore } from "@/stores/cartStore";
import { FaTrash } from "react-icons/fa";

interface Props {
  item: typCartItem;
}

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeFromCart } = useCartStore();

  return (
    <div className="max-w-3xl w-full border border-lightGray/60 rounded-lg px-6 bg-background min-h-[317px] flex">
      <div className="flex flex-col sm:flex-row gap-6 flex-1">
        {/* Product Image */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <img
            src={item.product.imagesUrl[0]}
            alt={item.product.name}
            className="w-48 h-32 object-contain rounded-md"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-center mb-4">
          {/* Top Section: Name + Trash */}
          <div className="flex items-start justify-between">
            <h2 className="font-semibold text-base text-content line-clamp-2 pr-2">
              {item.product.name}
            </h2>
            <button
              onClick={() => removeFromCart(item.id, item.selectedColor)}
              className="text-gray-400 hover:text-red-500 ml-2"
            >
              <FaTrash size={18} />
            </button>
          </div>

          {/* Middle Section: Brand + Color */}
          <div className="space-y-1 mt-2">
            <p className="text-sm text-gray-500">
              Brand: {item.product.brand.name}
            </p>
            {item.selectedColor && (
              <p className="text-sm text-gray-500">
                Color: {item.selectedColor.name}
              </p>
            )}
          </div>

          {/* Price Section */}
          <div className="mt-3">
            <ProductPrice item={item.product} />
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3 mt-5 border border-lightGray rounded-xl w-fit px-2 py-1">
            <button
              onClick={() =>
                updateQuantity(
                  item.id,
                  Math.max(item.quantity - 1, 1),
                  item.selectedColor
                )
              }
              className="w-8 h-8 flex items-center justify-center text-lg hover:text-primary"
            >
              –
            </button>
            <span className="min-w-[24px] text-center">{item.quantity}</span>
            <button
              onClick={() =>
                updateQuantity(item.id, item.quantity + 1, item.selectedColor)
              }
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
