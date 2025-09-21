// lib/services/categories.ts
import { typCategory } from "@/content/types";
import { apiClient, STRAPI_URL } from "../apiClient";



export async function fetchCategories(locale: string): Promise<typCategory[]> {
  const data = await apiClient<any>(
    "/categories",
    { cache: "force-cache" }, // ✅ Let it use default force-cache
    { populate: "*" },
    locale
  );

  return data.data.map((item: any) => ({
    id: item.id,
    name: item.CategoryName,
    icon: item.icon, // ✅ Store icon name instead of JSX element
    imageUrl: item.ImageURL ? `${STRAPI_URL}${item.ImageURL.url}` : undefined,
  }));
}
