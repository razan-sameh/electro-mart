// lib/services/categories.ts
import { typBrand } from "@/content/types";
import { apiClient } from "../apiClient";
import { BrandAdapter } from "@/adapters/BrandAdapter";
import { notFound } from "next/navigation";

const brandAdapter = BrandAdapter.getInstance();

export async function fetchBrands(locale: string): Promise<typBrand[]> {
  const data = await apiClient<any>(
    "/brands",
    { }, // ✅ Let it use default force-cache
    { populate: "*" },
    locale
  );
  if (!data.data) {
    notFound();
  }
  return data.data.map((brand: any) => brandAdapter.adapt(brand));

}
