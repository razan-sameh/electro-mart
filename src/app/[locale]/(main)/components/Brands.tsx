"use client";
import { useTranslations } from "next-intl";
import { useBrands } from "@/lib/hooks/useBrands";
import SectionHeader from "@/components/reusable/SectionHeader";

export default function Brands() {
  const { data: brands } = useBrands();
  const t = useTranslations("HomeSection");
  return (
    <section className="py-8 mt-6 pb-10">
      <SectionHeader title={t("brandsTitle")} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
        {brands.map(
          (b, i) =>
            b.imageUrl && (
              <img
                key={i}
                src={b.imageUrl}
                alt="brand"
                className="w-32 h-16 object-contain"
              />
            )
        )}
      </div>
    </section>
  );
}
