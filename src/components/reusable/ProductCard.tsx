import { typProduct } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { FaStar } from "react-icons/fa";
import ProductPrice from "./ProductPrice";

type ProductCardProps = {
  item: typProduct;
};

export default function ProductCard({ item }: ProductCardProps) {

  return (
    <Link
      href={`/products/${item.documentId}`}
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
          <ProductPrice item={item} />

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
