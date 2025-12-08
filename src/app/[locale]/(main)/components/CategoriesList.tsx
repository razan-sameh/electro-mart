"use client";
import { useCategories } from "@/lib/hooks/useCategories";
import { Link } from "@/i18n/navigation"; // ✅ localized Link

export default function CategoriesList() {
  const { data: categories = [] } = useCategories();

  return categories.map((c) => (
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
  ));
}
