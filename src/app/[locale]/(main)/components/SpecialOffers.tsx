"use client";
import { useTranslations } from "next-intl";
import { useSpecialOffers } from "@/lib/hooks/useProducts";
import { typProduct } from "@/content/types";
import ProductCard from "@/components/reusable/ProductCard";
import SectionHeader from "@/components/reusable/SectionHeader";

export default function SpecialOffers() {
  const t = useTranslations("HomeSection");
  const { data: offersWithMeta } = useSpecialOffers(5);
  const offers = offersWithMeta.data;
  return (
    <section className="py-8">
      {/* Header */}
      <SectionHeader
        title={t("specialOffersTitle")}
        linkText={t("viewAll")}
        linkHref="/categories?specialOffer=true"
      />

      {/* Offers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {offers.map((item: typProduct) => (
          <ProductCard item={item} key={item.documentId} />
        ))}
      </div>
    </section>
  );
}
