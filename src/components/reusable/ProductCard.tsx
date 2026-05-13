import { useMemo } from "react";
import { typProduct } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { FaStar } from "react-icons/fa";
import ProductPrice from "./ProductPrice";
import { FaCircleExclamation } from "react-icons/fa6";

type ProductCardProps = {
  item: typProduct;
};

export default function ProductCard({ item }: ProductCardProps) {
  const colorAttribute = useMemo(
    () =>
      item.defaultVariantAttributes?.find(
        (a) => a.attribute.toLowerCase() === "color",
      ),
    [item.defaultVariantAttributes],
  );

  const otherAttributes = useMemo(
    () =>
      item.defaultVariantAttributes?.filter(
        (a) => a.attribute.toLowerCase() !== "color",
      ) ?? [],
    [item.defaultVariantAttributes],
  );

  const defaultVariant = useMemo(
    () => item.variants?.find((v) => v.id === item.defaultVariantId),
    [item.variants, item.defaultVariantId],
  );

  const isOutOfStock = (defaultVariant?.stock ?? 0) <= 0;

  return (
    <Link
      href={`/products/${item.id}?variant=${item.defaultVariantId}`}
      className="bg-lightGray/20 rounded-lg shadow hover:shadow-lg transition text-start w-full cursor-pointer"
    >
      {/* Discount badge + Out of stock badge */}
      <div className="relative">
        {item.specialOffers?.title && (
          <span className="absolute top-2 bg-secondary text-white text-xs px-2 py-1 rounded-e-sm">
            {item.specialOffers.title}
          </span>
        )}

        {isOutOfStock && (
          <div className="absolute top-2 end-0 flex items-center gap-1 bg-red-100  text-xs font-bold px-2 py-1 rounded-s-sm">
            <FaCircleExclamation size={20} className="text-red-500" />
            <p className=" text-red-500 text-xs font-bold">Out of Stock</p>
          </div>
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
          <ProductPrice item={item} />
        </div>

        {/* Attributes */}
        {item.defaultVariantAttributes?.length > 0 && (
          <div className="my-2 text-sm text-gray-500">
            {colorAttribute && (
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colorAttribute.hexCode }}
                />
                <span>{colorAttribute.value}</span>
              </div>
            )}

            {otherAttributes.map((attr, index) => (
              <p key={index}>
                {attr.attribute}: {attr.value}
              </p>
            ))}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center justify-end text-sm text-gray-600">
          <FaStar className="w-4 h-4 fill-secondary mr-1" />
          {item.averageRating.toFixed(2)} ({item.totalReviews})
        </div>
      </div>
    </Link>
  );
}
