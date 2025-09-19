// lib/services/categories.ts
import { Category } from "@/content/types";
import { apiClient } from "../apiClient";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:1337";

export async function fetchCategories(locale: string): Promise<Category[]> {
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
