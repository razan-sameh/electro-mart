import { useMemo } from "react";
import { typProduct } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { FaStar } from "react-icons/fa";
import ProductPrice from "./ProductPrice";

type ProductCardProps = {
  item: typProduct;
};

export default function ProductCard({ item }: ProductCardProps) {
  // Color attribute from defaultVariantAttributes
  const colorAttribute = useMemo(
    () =>
      item.defaultVariantAttributes?.find(
        (a) => a.attribute.toLowerCase() === "color"
      ),
    [item.defaultVariantAttributes]
  );

  // Other attributes
  const otherAttributes = useMemo(
    () =>
      item.defaultVariantAttributes?.filter(
        (a) => a.attribute.toLowerCase() !== "color"
      ) ?? [],
    [item.defaultVariantAttributes]
  );

  return (
    <Link
      href={`/products/${item.id}?variant=${item.defaultVariantId}`}
      className="bg-lightGray/20 rounded-lg shadow hover:shadow-lg transition text-start w-full cursor-pointer"
    >
      {/* Discount badge */}
      <div className="relative">
        {item.specialOffers?.title && (
          <span className="absolute top-2 bg-secondary text-white text-xs px-2 py-1 rounded-e-sm">
            {item.specialOffers.title}
          </span>
        )}
        <img
          src={item.imagesUrl[0].url}
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
        </div>

        {/* Attributes */}
        {item.defaultVariantAttributes?.length > 0 && (
          <div className="my-2 text-sm text-gray-500">
            {/* Color */}
            {colorAttribute && (
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colorAttribute.hexCode }}
                />
                <span>{colorAttribute.value}</span>
              </div>
            )}

            {/* Other attributes */}
            {otherAttributes.map((attr, index) => (
              <p key={index}>
                {attr.attribute}: {attr.value}
              </p>
            ))}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center justify-end text-sm text-gray-600">
          <FaStar className="w-4 h-4 fill-black mr-1" />
          {item.averageRating.toFixed(2)} ({item.totalReviews})
        </div>
      </div>
    </Link>
  );
}
