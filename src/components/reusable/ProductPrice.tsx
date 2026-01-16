import { typProduct } from "@/content/types";
import { calculateDiscountedPrice } from "@/content/utils";
import React from "react";

interface ProductPriceProps {
  item: typProduct;
}
function ProductPrice({ item }: ProductPriceProps) {
  return (
    <div className="flex gap-2 items-center mb-2 flex-wrap">
      {item.specialOffers?.title && (
        <span className="text-gray-400 line-through">
          {item.originalPrice} E£
        </span>
      )}
      <span className="text-lg font-bold text-secondary">
        {item.displayPrice} E£
      </span>
    </div>
  );
}

export default ProductPrice;
