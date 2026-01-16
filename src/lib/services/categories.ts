// lib/services/categories.ts
import { typCategory } from "@/content/types";
import { CategoryAdapter } from "@/adapters/CategoryAdapter";
import { notFound } from "next/navigation";
import supabase from "../supabase";

const categoryAdapter = CategoryAdapter.getInstance();

export async function fetchCategories(locale: string): Promise<typCategory[]> {
  const { data, error } = await supabase.rpc("get_categories_by_locale", {
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
  return data.map((category: any) => categoryAdapter.adapt(category));
}

export async function fetchCategoryById(
  id: number,
  locale: string
): Promise<typCategory> {
  const { data, error } = await supabase.rpc("get_category_by_id", {
    cid: id,
    locale: locale,
  });

  if (error) {
    console.error(error);
    notFound();
  }

  if (!data) {
    notFound();
  }

  return categoryAdapter.adapt(data);
}
