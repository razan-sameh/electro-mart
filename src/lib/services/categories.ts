// lib/services/categories.ts
import { typCategory } from "@/content/types";
import { apiClient } from "../apiClient";
import { CategoryAdapter } from "@/adapters/CategoryAdapter";
import { notFound } from "next/navigation";
import supabase from "../supabase";
import { CategoryDB } from "@/adapters/interfaces/types";

const categoryAdapter = CategoryAdapter.getInstance();

export async function fetchCategories(locale: string): Promise<typCategory[]> {
  const { data, error } = await supabase
    .from("category_translations")
    .select(
      `
      title,
      category (
        id,
        image_url,
        icon
      )
    `
    )
    .eq("lang", locale);

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
  const { data, error } = await supabase
    .from("category_translations")
    .select(
      `
      title,
      category (
        id,
        image_url,
        icon
      )
    `
    )
    .eq("lang", locale)
    .eq("category_id", id)
    .single();

  if (error) {
    console.error(error);
    notFound();
  }

  if (!data) {
    notFound();
  }
  // tell TypeScript that categories is object
  const categoryDB: CategoryDB = {
    title: data.title,
    category: Array.isArray(data.category)
      ? data.category[0]
      : data.category,
  };

  return categoryAdapter.adapt(categoryDB);
}
