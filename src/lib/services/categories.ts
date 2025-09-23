// lib/services/categories.ts
import { typCategory } from "@/content/types";
import { apiClient, STRAPI_URL } from "../apiClient";
import { CategoryAdapter } from "@/adapters/CategoryAdapter";

const categoryAdapter = CategoryAdapter.getInstance(STRAPI_URL);

export async function fetchCategories(locale: string): Promise<typCategory[]> {
  const data = await apiClient<any>(
    "/categories",
    { cache: "force-cache" }, // ✅ Let it use default force-cache
    { populate: "*" },
    locale
  );

  return data.data.map((category: any) => categoryAdapter.adapt(category));
}

export async function fetchCategoryById(id: string, locale: string) {
  const data = await apiClient<any>(
    `/categories/${id}`, // single category endpoint
    {},
    { populate: "*" },
    locale
  );

  // adapt single object instead of mapping
  return categoryAdapter.adapt(data.data);
}

