"use client";
import { useTranslations } from "next-intl";
import SectionHeader from "@/components/reusable/SectionHeader";
import { Suspense } from "react";
import SpecialOffersProducts from "./SpecialOffersProducts";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";

export default function SpecialOffers() {
  const t = useTranslations("HomeSection");
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
        <Suspense
          fallback={
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </>
          }
        >
          <SpecialOffersProducts />
        </Suspense>
      </div>
    </section>
  );
}
