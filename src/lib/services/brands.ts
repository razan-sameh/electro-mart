// lib/services/categories.ts
import { typBrand } from "@/content/types";
import { apiClient, STRAPI_URL } from "../apiClient";

export async function fetchBrands(locale: string): Promise<typBrand[]> {
  const data = await apiClient<any>(
    "/brands",
    { cache: "force-cache" }, // ✅ Let it use default force-cache
    { populate: "*" },
    locale
  );

  return data.data.map((item: any) => ({
    id: item.id,
    name: item.Name,
    imageUrl: item.LogoURL ? `${STRAPI_URL}${item.LogoURL.url}` : undefined,
  }));
}
