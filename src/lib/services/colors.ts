// lib/services/categories.ts
import { typBrand, typColor } from "@/content/types";
import { apiClient, STRAPI_URL } from "../apiClient";
import { BrandAdapter } from "@/adapters/BrandAdapter";
import { ColorAdapter } from "@/adapters/ColorAdapter";

const colorAdapter = ColorAdapter.getInstance(STRAPI_URL);

export async function fetchColors(locale: string): Promise<typColor[]> {
  const data = await apiClient<any>(
    "/product-colors",
    { cache: "force-cache" }, // ✅ Let it use default force-cache
    { populate: "*" },
    locale
  );

  return data.data.map((color: any) => colorAdapter.adapt(color));

}
