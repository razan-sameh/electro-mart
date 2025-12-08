"use client";
import { useTranslations } from "next-intl";
import SectionHeader from "@/components/reusable/SectionHeader";
import BrandsList from "./BrandsList";
import { Suspense } from "react";
import BrandSkeleton from "./BrandSkeleton";

export default function Brands() {
  const t = useTranslations("HomeSection");
  return (
    <section className="py-8 mt-6 pb-10">
      <SectionHeader title={t("brandsTitle")} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
        <Suspense
          fallback={Array.from({ length: 10 }).map((_, i) => (
            <BrandSkeleton key={i} />
          ))}
        >
          <BrandsList />
        </Suspense>
      </div>
    </section>
  );
}
