// lib/services/categories.ts
import {typColor } from "@/content/types";
import { apiClient, STRAPI_URL } from "../apiClient";
import { ColorAdapter } from "@/adapters/ColorAdapter";

const colorAdapter = ColorAdapter.getInstance(STRAPI_URL);

export async function fetchColors(locale: string): Promise<typColor[]> {
  const data = await apiClient<any>(
    "/product-colors",
    {}, // ✅ Let it use default force-cache
    { populate: "*" },
    locale
  );

  return data.data.map((color: any) => colorAdapter.adapt(color));

}
