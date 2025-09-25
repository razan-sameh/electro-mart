// lib/services/categories.ts
import { typBrand } from "@/content/types";
import { apiClient, STRAPI_URL } from "../apiClient";
import { BrandAdapter } from "@/adapters/BrandAdapter";

const brandAdapter = BrandAdapter.getInstance(STRAPI_URL);

export async function fetchBrands(locale: string): Promise<typBrand[]> {
  const data = await apiClient<any>(
    "/brands",
    { }, // ✅ Let it use default force-cache
    { populate: "*" },
    locale
  );

  return data.data.map((brand: any) => brandAdapter.adapt(brand));

}
