"use client";

import { enmDiscountType } from "@/content/enums";
import { typProduct } from "@/content/types";
import { FaStar } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";

interface Props {
  product: typProduct;
}

export default function ProductInfo({ product }: Props) {
  // Calculate discounted price based on discount type
  let discountedPrice = product.price;
  if (product.specialOffers) {
    const offer = product.specialOffers[0];
    if (offer?.discountType === enmDiscountType.percentage) {
      discountedPrice = product.price - product.price * (offer.discountValue / 100);
    } else if (offer?.discountType === enmDiscountType.fixed) {
      discountedPrice = product.price - offer.discountValue;
    }
  }

  if (discountedPrice < 0) discountedPrice = 0;

  const formattedDiscountedPrice = discountedPrice.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }) + " €";

  return (
    <div className="flex flex-col gap-6">
      {/* Product Name */}
      <h1 className="text-3xl font-bold text-content">{product.name}</h1>

      {/* Rating */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FaStar size={16} className="fill-secondary" />
        <span className="text-content">{product.averageRating} ({product.totalReviews})</span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        {product.specialOffers?.[0] && (
          <span className="text-gray-400 line-through text-lg">{product.price} €</span>
        )}
        <span className="text-2xl font-bold text-secondary">{formattedDiscountedPrice}</span>
      </div>

      {/* Colors */}
      {product.colors?.length && (
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">Choose Color:</h3>
          <div className="flex gap-2 flex-wrap">
            {product.colors.map((color) => (
              <div
                key={color.id}
                className="w-6 h-6 rounded-full border-2 border-gray-300 cursor-pointer"
                style={{ backgroundColor: color.hexCode }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-4">
        <button className="flex-1 px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition">
          Add to Cart
        </button>
        <button className="flex-1 px-6 py-3 bg-lightGray/40 rounded-lg shadow hover:bg-lightGray/60 transition">
          Buy Now
        </button>
        <button className="px-4 py-3 bg-lightGray/40 rounded-lg shadow hover:bg-lightGray/60 transition">
          <FiHeart size={20} />
        </button>
      </div>
    </div>
  );
}
