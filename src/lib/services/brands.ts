// lib/services/categories.ts
import { typBrand } from "@/content/types";
import { BrandAdapter } from "@/adapters/BrandAdapter";
import { notFound } from "next/navigation";
import supabase from "../supabase";

const brandAdapter = BrandAdapter.getInstance();

export async function fetchBrands(locale: string): Promise<typBrand[]> {
  const { data, error } = await supabase
    .from("brand_translations")
    .select(
      `
      name,
      brand (
        id,
        logo_url
      )
    `
    )
    .eq("lang", locale);

  if (error) {
    console.error(error);
    notFound();
  }

  if (!data || data.length === 0) {
    notFound();
  }

  // adapt data to typCategory
  return data.map((brand: any) => brandAdapter.adapt(brand));
}
