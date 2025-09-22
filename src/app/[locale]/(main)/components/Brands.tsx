'use client'
import { useTranslations } from "next-intl";
import SectionHeader from "./SectionHeader";
import { useBrands } from "@/lib/hooks/useBrands";

export default function Brands() {
  const { data: brands } = useBrands();
  const t = useTranslations("HomeSection");
  return (
    <section className="py-8 mt-6">
      <SectionHeader title={t("brandsTitle")} />

      <div className="grid grid-cols-5 gap-6 justify-items-center">
        {brands.map((b, i) => (
          <img
            key={i}
            src={b.imageUrl}
            alt="brand"
            className="w-32 h-16 object-contain"
          />
        ))}
      </div>
    </section>
  );
}
