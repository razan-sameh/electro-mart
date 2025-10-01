import { typProduct } from "@/content/types";
import { calculateDiscountedPrice } from "@/content/utils";
import React from "react";

interface ProductPriceProps {
  item: typProduct;
}
function ProductPrice({ item }: ProductPriceProps) {
  const discountedPrice = calculateDiscountedPrice(item);
  const formattedDiscountedPrice =
    discountedPrice.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }) + " €";

  return (
    <div className="flex gap-2 items-center mb-2">
      {item.specialOffers?.[0] && (
        <span className="text-gray-400 line-through">{item.price} €</span>
      )}
      <span className="text-lg font-bold text-secondary">
        {formattedDiscountedPrice}
      </span>
    </div>
  );
}

export default ProductPrice;
