// lib/services/categories.ts
import { typCategory } from "@/content/types";
import { apiClient } from "../apiClient";
import { CategoryAdapter } from "@/adapters/CategoryAdapter";
import { notFound } from "next/navigation";

const categoryAdapter = CategoryAdapter.getInstance();

export async function fetchCategories(locale: string): Promise<typCategory[]> {
  const data = await apiClient<any>(
    "/categories",
    {}, // ✅ Let it use default force-cache
    { populate: "*" },
    locale
  );
  if (!data) {
    notFound();
  }
  return data.data.map((category: any) => categoryAdapter.adapt(category));
}

export async function fetchCategoryById(id: string, locale: string) {
  const data = await apiClient<any>(
    `/categories/${id}`, // single category endpoint
    {},
    { populate: "*" },
    locale
  );
  if (!data) {
    notFound();
  }
  // adapt single object instead of mapping
  return categoryAdapter.adapt(data.data);
}

export async function fetchCategoryByName(name: string, locale: string) {
  const queryParams: Record<string, any> = {
    "filters[CategoryName][$eq]": name, // $eqi → case-insensitive
  };

  const data = await apiClient<any>("/categories", {}, queryParams, locale);

  if (!data.data?.[0]) {
    notFound();
  }

  return categoryAdapter.adapt(data.data[0]);
}
