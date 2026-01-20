import { typProduct } from "@/content/types";
import { FaStar } from "react-icons/fa";

type Props = {
  product: typProduct;
  selectedVariant: any;
  formattedDiscountedPrice: string;
};

export default function ProductHeader({
  product,
  selectedVariant,
  formattedDiscountedPrice,
}: Props) {
  return (
    <>
      <h1 className="text-3xl font-bold text-content">{product.name}</h1>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FaStar size={16} className="fill-secondary" />
        <span className="text-content">
          {product.averageRating.toFixed(2)} ({product.totalReviews})
        </span>
      </div>

      <div className="flex items-baseline gap-3">
        {selectedVariant?.offer?.discount_percent ? (
          <span className="text-gray-400 line-through text-lg">
            {selectedVariant.price} E£
          </span>
        ) : null}
        <span className="text-2xl font-bold text-secondary">
          {formattedDiscountedPrice}
        </span>
      </div>
    </>
  );
}
