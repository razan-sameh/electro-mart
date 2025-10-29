"use client";
import ProductCard from "@/components/reusable/ProductCard";
import SectionHeader from "@/components/reusable/SectionHeader";
import { typProduct } from "@/content/types";
import { useSimilarProducts } from "@/lib/hooks/useProducts";
import { useTranslations } from "next-intl";

interface Props {
  product: typProduct;
}

export default function SimilarProducts({ product }: Props) {
  const { data: similarProducts } = useSimilarProducts(
    product.documentId,
    product.category?.id
    // product.brand?.id
  );
  const t = useTranslations("HomeSection");
  return (
    <div className="mt-12">
      <SectionHeader
        title={"Similar Picks for You"}
        linkText={t("viewAll")}
        linkHref={`/categories/${product.category?.id}`}
      />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {similarProducts?.map((item: typProduct) => (
          <ProductCard item={item} key={item.documentId} />
        ))}
      </div>
    </div>
  );
}
