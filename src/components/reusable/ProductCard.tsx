import { enmDiscountType } from "@/content/enums";
import { typSpecialOffer } from "@/content/types";
import { FaStar } from "react-icons/fa";

type ProductCardProps = {
  title: string;
  offer?: typSpecialOffer;
  price: number;
  img: string;
  rating: number;
  reviews: number;
  onClick?: () => void;
};

export default function ProductCard({
  title,
  offer,
  price,
  img,
  rating,
  reviews,
  onClick,
}: ProductCardProps) {

  // Calculate discounted price based on discount type
  let discountedPrice = price;
  if (offer) {
    if (offer.discountType === enmDiscountType.percentage) {
      discountedPrice = price - price * (offer.discountValue / 100);
    } else if (offer.discountType === enmDiscountType.fixed) {
      discountedPrice = price - offer.discountValue;
    }
  }

  // Prevent negative prices
  if (discountedPrice < 0) discountedPrice = 0;

  const formattedDiscountedPrice =
    discountedPrice.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }) + " €";

  return (
    <button
      onClick={onClick}
      className="bg-lightGray/20 dark:bg-gray-900 rounded-lg shadow hover:shadow-lg transition text-start w-full cursor-pointer"
    >
      {/* Discount badge */}
      <div className="relative">
        {offer && (
          <span className="absolute top-2 bg-secondary text-white text-xs px-2 py-1 rounded-e-sm">
            {offer.title}
          </span>
        )}
        <img
          src={img}
          alt={title}
          className="w-full h-36 object-contain mb-3"
        />
      </div>

      {/* Title & Price */}
      <div className="p-4">
        <h3 className="text-sm font-medium mb-2">{title}</h3>

        <div className="flex justify-between items-center">
          {/* Price */}
          <div className="flex gap-2 items-center mb-2">
            {offer && (
              <span className="text-gray-400 line-through">{price} €</span>
            )}
            <span className="text-lg font-bold text-secondary">
              {formattedDiscountedPrice}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center text-sm text-gray-600">
            <FaStar className="w-4 h-4 fill-black mr-1" />
            {rating} ({reviews})
          </div>
        </div>
      </div>
    </button>
  );
}
