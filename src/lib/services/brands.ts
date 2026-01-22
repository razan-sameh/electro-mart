// lib/services/categories.ts
import { typBrand } from "@/content/types";
import { BrandAdapter } from "@/adapters/BrandAdapter";
import { notFound } from "next/navigation";
import supabase from "../supabase";

const brandAdapter = BrandAdapter.getInstance();

export async function fetchBrands(locale: string): Promise<typBrand[]> {
  const { data, error } = await supabase.rpc("get_brands_by_locale", {
    locale: locale,
  });

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
