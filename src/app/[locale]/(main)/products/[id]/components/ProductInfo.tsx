"use client";

import { typProduct, typProductVariant } from "@/content/types";
import { useReducer, useMemo, useCallback, useEffect } from "react";
import { cartItemReducer } from "./cartItemReducer";
import ProductHeader from "./ProductHeader";
import ProductAttributes from "./ProductAttributes";
import QuantitySelector from "./QuantitySelector";
import ProductActions from "./ProductActions";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";

interface Props {
  product: typProduct;
}

export default function ProductInfo({ product }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const variantIdFromUrl = searchParams.get("variant");
  // Extract all attribute types (Color, Storage, RAM, etc)
  const attributesMap = useMemo(() => {
    const map: Record<string, Set<string>> = {};

    product.variants.forEach((v) => {
      v.attributes.forEach((attr) => {
        if (!map[attr.attribute]) map[attr.attribute] = new Set();
        map[attr.attribute].add(attr.value);
      });
    });

    return map;
  }, [product.variants]);

  // Default selected attributes
  const defaultSelectedAttributes = useMemo(() => {
    const result: Record<string, string> = {};
    Object.keys(attributesMap).forEach((key) => {
      result[key] = Array.from(attributesMap[key])[0];
    });
    return result;
  }, [attributesMap]);

  const initialSelectedAttributes = useMemo(() => {
    if (!variantIdFromUrl) {
      return defaultSelectedAttributes;
    }

    const variant = product.variants.find(
      (v) => v.id === Number(variantIdFromUrl),
    );

    if (!variant) {
      return defaultSelectedAttributes;
    }

    const attrs: Record<string, string> = {};

    variant.attributes.forEach((attr) => {
      attrs[attr.attribute] = attr.value;
    });

    return attrs;
  }, [variantIdFromUrl, product.variants, defaultSelectedAttributes]);

  const [state, dispatch] = useReducer(cartItemReducer, {
    quantity: 1,
    selectedAttributes: initialSelectedAttributes,
  });

  // Find matching variant based on selected attributes
  const selectedVariant = useMemo(() => {
    return product.variants.find((v) =>
      v.attributes.every(
        (attr) => state.selectedAttributes[attr.attribute] === attr.value,
      ),
    );
  }, [product.variants, state.selectedAttributes]);
  const isOutOfStock = (selectedVariant?.stock ?? 0) <= 0;

  const handleAttributeChange = useCallback(
    (updatedSelection: Record<string, string>) => {
      dispatch({
        type: "SELECT_ATTRIBUTE",
        payload: updatedSelection,
      });

      // Find the matching variant for the new selection
      const matchedVariant = product.variants.find((v) =>
        v.attributes.every(
          (attr) => updatedSelection[attr.attribute] === attr.value,
        ),
      );

      if (matchedVariant) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("variant", String(matchedVariant.id));
        router.replace(`?${params.toString()}`, { scroll: false });
      }
    },
    [product.variants, searchParams, router],
  );

  const discountedPrice = useMemo(() => {
    if (!selectedVariant) return 0;

    const offer = selectedVariant.offer;
    const price = selectedVariant.price;

    if (offer && offer.discountPercent) {
      return price - (price * offer.discountPercent) / 100;
    }
    return price;
  }, [selectedVariant]);

  const formattedDiscountedPrice =
    discountedPrice.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }) + " E£";

  return (
    <div className="flex flex-col gap-6">
      <ProductHeader
        product={product}
        selectedVariant={selectedVariant!}
        formattedDiscountedPrice={formattedDiscountedPrice}
      />

      <ProductAttributes
        product={product}
        attributesMap={attributesMap}
        state={state}
        dispatch={dispatch}
        onAttributeChange={handleAttributeChange}
      />
      <div className="flex items-center gap-2 min-w-[140px]">
        {isOutOfStock ? (
          <>
            <FaCircleExclamation size={18} className="text-red-500 shrink-0" />
            <p className="text-red-500 text-sm font-bold">Out of Stock</p>
          </>
        ) : (
          <>
            <FaCircleCheck size={18} className="text-[#087f3d] shrink-0" />
            <p className="text-[#087f3d] text-sm font-bold">
              In Stock ({selectedVariant?.stock})
            </p>
          </>
        )}
      </div>
      <QuantitySelector
        quantity={state.quantity}
        dispatch={dispatch}
        isOutOfStock={isOutOfStock}
      />

      <ProductActions
        product={product}
        state={state}
        selectedVariant={selectedVariant!}
        isOutOfStock={isOutOfStock}
      />
    </div>
  );
}
