// Get spec types for a category

import { SpecificationTypeAdapter } from "@/adapters/SpecificationTypeAdapter";
import { apiClient, STRAPI_URL } from "../apiClient";
const specificationTypeAdapter =
  SpecificationTypeAdapter.getInstance(STRAPI_URL);

// categoryId optional
export const fetchSpecification = async (locale: string, categoryId?: string) => {
  const queryParams: Record<string, any> = {
    "populate[specification_values][populate]": "specification_type",
  };

  if (categoryId) {
    queryParams[
      "filters[specification_values][products][category][documentId][$eq]"
    ] = categoryId;
  }

  const res = await apiClient<any>(
    "/specification-types",
    {},
    queryParams,
    locale
  );

  return res.data.map((spec: any) => specificationTypeAdapter.adapt(spec));
};
