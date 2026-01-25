"use client";

import { useState, useMemo, useCallback } from "react";
import { typWishlistItem } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { FaStar } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { useCart } from "@/lib/hooks/useCart";
import React from "react";

type productCardProps = {
  item: typWishlistItem;
  onRemove: (itemId: number) => void;
};

function WishListCard({ item, onRemove }: productCardProps) {
  const t = useTranslations("Wishlist");
  const { cart, addItem } = useCart();
  const [added, setAdded] = useState(false);

  const colorAttributes = useMemo(
    () =>
      item.variant.attributes?.filter(
        (a) => a.attribute.toLowerCase() === "color"
      ) ?? [],
    [item.variant.attributes]
  );

  const otherAttributes = useMemo(
    () =>
      item.variant.attributes?.filter(
        (a) => a.attribute.toLowerCase() !== "color"
      ) ?? [],
    [item.variant.attributes]
  );

  const isInCart = useMemo(() => {
    return cart?.items.some(
      (cartItem) => cartItem.variant.id === item.variant.id
    );
  }, [cart?.items, item.variant.id]);

  const handleRemove = () => onRemove(item.id);

  const handleAddToCart = useCallback(async () => {
    if (isInCart || added) return;
    setAdded(true);

    try {
      await addItem({
        variantId: item.variant.id,
        quantity: 1,
      });
    } catch (err) {
      console.error("Failed to add to cart", err);
      setAdded(false);
    }
  }, [isInCart, added, addItem, item.variant.id]);

  return (
    <div className="relative bg-background rounded-lg shadow hover:shadow-lg transition text-start w-full">
      {/* Remove button */}
      <button
        onClick={handleRemove}
        className="absolute top-2 right-2 z-10 bg-body/90 hover:bg-white rounded-full p-1.5 shadow-sm transition"
        aria-label={t("remove")}
      >
        <IoMdClose className="w-4 h-4 text-content" />
      </button>

      <Link href={`/products/${item?.product?.id}`} className="block">
        <div className="relative">
          {item?.product?.specialOffers?.title && (
            <span className="absolute top-2 left-0 bg-secondary text-white text-xs px-2 py-1 rounded-e-sm">
              {item?.product?.specialOffers?.title}
            </span>
          )}
          <img
            src={item?.product?.imagesUrl?.[0]?.url}
            alt={item?.product?.name}
            className="w-full h-48 object-contain mb-3 p-4"
          />
        </div>

        <div className="p-4 pt-0">
          <h3 className="text-sm font-medium mb-2 line-clamp-2">
            {item?.product?.name}
          </h3>

          {/* Color */}
          {colorAttributes.length > 0 && (
            <div className="flex items-center">
              {colorAttributes.map((colorAttr) => (
                <div key={colorAttr.id} className="flex items-center">
                  <div
                    className="w-5 h-5 rounded-full border-2 cursor-pointer me-2"
                    style={{ backgroundColor: colorAttr.hexCode }}
                  />
                  <p>{colorAttr.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Other attributes */}
          {otherAttributes.length > 0 && (
            <div className="my-2 text-sm text-gray-500">
              {otherAttributes.map((attr) => (
                <p key={attr.id}>
                  {attr.attribute}: {attr.value}
                </p>
              ))}
            </div>
          )}

          <div className="flex gap-2 items-center mb-2 flex-wrap mt-3 ">
            {item?.appliedOffer?.title != "" && (
              <span className="text-gray-400 line-through">
                E£ {item?.originalPrice?.toFixed(2)}
              </span>
            )}
            <span className="text-lg font-bold text-secondary">
              E£ {item?.displayPrice?.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-end items-center mt-3">
            <div className="flex items-center text-sm text-gray-600">
              <FaStar className="w-4 h-4 fill-yellow-400 mr-1" />
              {item?.product?.averageRating?.toFixed(2)} (
              {item?.product?.totalReviews})
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        {isInCart || added ? (
          <div className="w-full bg-gray-300 text-gray-700 py-2.5 px-4 rounded-md flex items-center justify-center gap-2 text-sm font-medium cursor-default">
            {t("addedToCart")}
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-white py-2.5 px-4 rounded-md hover:bg-primary/90 transition flex items-center justify-center gap-2 text-sm font-medium"
          >
            <FiShoppingCart className="w-4 h-4" />
            {t("addToCart")}
          </button>
        )}
      </div>
    </div>
  );
}

export default React.memo(WishListCard);
