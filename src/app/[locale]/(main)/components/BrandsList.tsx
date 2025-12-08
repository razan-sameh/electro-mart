"use client";
import { useBrands } from "@/lib/hooks/useBrands";

export default function BrandsList() {
  const { data: brands } = useBrands();
  return brands.map(
    (b, i) =>
      b.imageUrl && (
        <img
          key={i}
          src={b.imageUrl}
          alt="brand"
          className="w-32 h-16 object-contain"
        />
      )
  );
}
