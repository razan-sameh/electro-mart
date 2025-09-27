"use client";
import ProductCard from "@/components/reusable/ProductCard";
import SectionHeader from "@/components/reusable/SectionHeader";
import { useCategoryByName } from "@/lib/hooks/useCategories";
import { useProducts } from "@/lib/hooks/useProducts";
import { useTranslations } from "next-intl";

export default function ProductAccessories() {
  const { data: accessoriesCategory } = useCategoryByName("Accessories");
  const t = useTranslations("HomeSection");
  const { data: accessories } = useProducts(accessoriesCategory?.id, 1, 5);

  return (
    <div className="mt-12">
      <SectionHeader
        title={"Add these accessories to your order"}
        linkText={t("viewAll")}
        linkHref={`/categories/${accessoriesCategory?.id}`}
      />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {accessories.data.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
