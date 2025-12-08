"use client";
import { useTranslations } from "next-intl";
import SectionHeader from "@/components/reusable/SectionHeader";
import { Suspense } from "react";
import CategorySkeleton from "./CategorySkeleton";
import CategoriesList from "./CategoriesList";

export default function Categories() {
  const t = useTranslations("HomeSection");

  return (
    <section className="py-8">
      <SectionHeader title={t("categoriesTitle")} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Suspense
          fallback={
            <>
              {Array.from({ length: 12}).map((_, i) => (
                <CategorySkeleton key={i} />
              ))}
            </>
          }
        >
          <CategoriesList />
        </Suspense>
      </div>
    </section>
  );
}
