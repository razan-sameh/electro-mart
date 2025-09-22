"use client";
import { useTranslations } from "next-intl";
import SectionHeader from "./SectionHeader";
import { useCategories } from "@/lib/hooks/useCategories";
import { Link } from "@/i18n/navigation"; // ✅ localized Link

export default function Categories() {
  const { data: categories = [] } = useCategories();
  const t = useTranslations("HomeSection");

  return (
    <section className="py-8">
      <SectionHeader title={t("categoriesTitle")} />
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/categories/${c.id}`}
            className="flex flex-col items-center p-3 bg-lightGray/20 border border-lightGray/20 rounded-md hover:bg-lightGray/40 transition cursor-pointer"
          >
            {c.imageUrl && (
              <img
                src={c.imageUrl}
                alt={c.name}
                className="w-12 h-12 mb-2 object-contain"
              />
            )}
            <p className="text-sm">{c.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
