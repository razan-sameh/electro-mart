// lib/services/categories.ts
import { typColor } from "@/content/types";
import { apiClient } from "../apiClient";
import { ColorAdapter } from "@/adapters/ColorAdapter";
import { notFound } from "next/navigation";

const colorAdapter = ColorAdapter.getInstance();

export async function fetchColors(locale: string): Promise<typColor[]> {
  const data = await apiClient<any>(
    "/product-colors",
    {}, // ✅ Let it use default force-cache
    { populate: "*" },
    locale
  );
  if (!data.data) {
    notFound();
  }
  return data.data.map((color: any) => colorAdapter.adapt(color));
}
