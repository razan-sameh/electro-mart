import { enmDiscountType } from "@/content/enums";
import { typProduct } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { FaStar } from "react-icons/fa";

type ProductCardProps = {
  item: typProduct;
};

export default function ProductCard({ item }: ProductCardProps) {
  // Calculate discounted price based on discount type
  let discountedPrice = item.price;
  if (item.specialOffers) {
    if (item.specialOffers[0]?.discountType === enmDiscountType.percentage) {
      discountedPrice =
        item.price - item.price * (item.specialOffers[0].discountValue / 100);
    } else if (item.specialOffers[0]?.discountType === enmDiscountType.fixed) {
      discountedPrice = item.price - item.specialOffers[0].discountValue;
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
    <Link
      href={`/products/${item.id}`}
      className="bg-lightGray/20 rounded-lg shadow hover:shadow-lg transition text-start w-full cursor-pointer"
    >
      {/* Discount badge */}
      <div className="relative">
        {item.specialOffers?.[0] && (
          <span className="absolute top-2 bg-secondary text-white text-xs px-2 py-1 rounded-e-sm">
            {item.specialOffers[0].title}
          </span>
        )}
        <img
          src={item.imagesUrl[0]}
          alt={item.name}
          className="w-full h-36 object-contain mb-3"
        />
      </div>

      {/* Title & Price */}
      <div className="p-4">
        <h3 className="text-sm font-medium mb-2">{item.name}</h3>

        <div className="flex justify-between items-center">
          {/* Price */}
          <div className="flex gap-2 items-center mb-2">
            {item.specialOffers?.[0] && (
              <span className="text-gray-400 line-through">{item.price} €</span>
            )}
            <span className="text-lg font-bold text-secondary">
              {formattedDiscountedPrice}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center text-sm text-gray-600">
            <FaStar className="w-4 h-4 fill-black mr-1" />
            {item.averageRating} ({item.totalReviews})
          </div>
        </div>
      </div>
    </Link>
  );
}
