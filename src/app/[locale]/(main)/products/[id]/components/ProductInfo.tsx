"use client";

import { typProduct, typProductVariant } from "@/content/types";
import { useReducer, useMemo, useCallback, useEffect } from "react";
import { cartItemReducer } from "./cartItemReducer";
import ProductHeader from "./ProductHeader";
import ProductAttributes from "./ProductAttributes";
import QuantitySelector from "./QuantitySelector";
import ProductActions from "./ProductActions";
import { useSearchParams } from "next/navigation";

interface Props {
  product: typProduct;
}

export default function ProductInfo({ product }: Props) {
    const searchParams = useSearchParams();
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

  const [state, dispatch] = useReducer(cartItemReducer, {
    quantity: 1,
    selectedAttributes: defaultSelectedAttributes,
  });
 // **هنا نعمل useEffect عشان نحدد selection من URL**
  useEffect(() => {
    if (!variantIdFromUrl) return;

    const selectedVariant = product.variants.find(
      (v) => v.id === Number(variantIdFromUrl)
    );

    if (!selectedVariant) return;

    const selectedAttributes: Record<string, string> = {};
    selectedVariant.attributes.forEach((attr) => {
      selectedAttributes[attr.attribute] = attr.value;
    });

    dispatch({
      type: "SELECT_ATTRIBUTE",
      payload: selectedAttributes,
    });
  }, [variantIdFromUrl, product.variants]);
  // Find matching variant based on selected attributes
  const selectedVariant = useMemo(() => {
    return product.variants.find((v) =>
      v.attributes.every(
        (attr) => state.selectedAttributes[attr.attribute] === attr.value
      )
    );
  }, [product.variants, state.selectedAttributes]);

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
        selectedVariant={selectedVariant}
        formattedDiscountedPrice={formattedDiscountedPrice}
      />

      <ProductAttributes
        product={product}
        attributesMap={attributesMap}
        state={state}
        dispatch={dispatch}
      />

      <QuantitySelector quantity={state.quantity} dispatch={dispatch} />

      <ProductActions
        product={product}
        state={state}
        selectedVariant={selectedVariant!}
      />
    </div>
  );
}
