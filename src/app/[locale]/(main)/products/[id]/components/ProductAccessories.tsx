"use client";
import ProductCard from "@/components/reusable/ProductCard";
import SectionHeader from "@/components/reusable/SectionHeader";
import { typProduct } from "@/content/types";
import { useAccessoriesProducts } from "@/lib/hooks/useProducts";
import { useTranslations } from "next-intl";

export default function ProductAccessories() {
  const t = useTranslations("HomeSection");
  const { data: accessories  } = useAccessoriesProducts(5); // 👈 Single query!

  if (!accessories || accessories.length === 0) return null;

  return (
    <div className="mt-12">
      <SectionHeader
        title={t("accessoriesTitle")}
        linkText={t("viewAll")}
        linkHref={`/categories/${accessories[0].category.id}`}
      />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {accessories.map((item:typProduct) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
