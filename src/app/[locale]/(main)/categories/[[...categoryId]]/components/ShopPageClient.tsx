"use client";
import { useEffect, useState, useMemo } from "react";
import Filters from "./Filters";
import ShopProducts from "./ShopProducts";
import { useCategoryWithSpecs } from "@/lib/hooks/useCategories";
import { useProducts } from "@/lib/hooks/useProducts";
import { typSpecificationType } from "@/content/types";

export default function ShopPageClient({
  categoryId,
}: {
  categoryId?: string[];
}) {
  const { data: products } = useProducts();
  const currentCategoryId = categoryId?.[0];
  // Always call the hook - it will only fetch when currentCategoryId exists
  const { data: categoryWithSpecs } = useCategoryWithSpecs(currentCategoryId!);

  // Extract specification types from products when no category
  const productSpecificationTypes = useMemo((): typSpecificationType[] => {
    if (!products?.length) return [];

    const specTypesMap = new Map<string, typSpecificationType>();

    products.forEach((product) => {
      product.specificationValues?.forEach((specVal) => {
        const specType = specVal.specificationType;
        if (specType && !specTypesMap.has(specType.id)) {
          // Create a new spec type with values found in products
          specTypesMap.set(specType.id, {
            id: specType.id,
            name: specType.name,
            specificationValues: [],
          });
        }

        // Add the specification value if not already added
        const existingSpecType = specTypesMap.get(specType!.id);
        if (
          existingSpecType &&
          !existingSpecType.specificationValues?.some(
            (val) => val.id === specVal.id
          )
        ) {
          existingSpecType.specificationValues =
            existingSpecType.specificationValues || [];
          existingSpecType.specificationValues.push({
            id: specVal.id,
            name: specVal.name,
            specificationType: specType,
          });
        }
      });
    });

    // Sort specification values within each type
    Array.from(specTypesMap.values()).forEach((specType) => {
      specType.specificationValues?.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    });

    return Array.from(specTypesMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [products]);

  // Determine which specification types to use
  const specificationTypes: typSpecificationType[] = useMemo(() => {
    if (currentCategoryId && categoryWithSpecs?.specificationTypes) {
      return categoryWithSpecs.specificationTypes;
    }
    return productSpecificationTypes;
  }, [currentCategoryId, categoryWithSpecs, productSpecificationTypes]);

  return (
    <div className="flex gap-6 px-6 py-8">
      <aside className="w-64 shrink-0">
        <Filters
          specificationTypes={specificationTypes}
        />
      </aside>

      <ShopProducts
        categoryName={categoryWithSpecs?.name || "All Products"}
        products={products}
      />
    </div>
  );
}
