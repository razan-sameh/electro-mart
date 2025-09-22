import { ProductAdapter } from "@/adapters/ProductAdapter";
import { apiClient, STRAPI_URL } from "../apiClient";
import { ProductFilters, typProduct } from "@/content/types";

const productAdapter = ProductAdapter.getInstance(STRAPI_URL);

export const getProducts = async (
  locale: string,
  filters?: ProductFilters
): Promise<typProduct[]> => {
  // Initialize queryParams object
  // const queryParams: Record<string, any> = {
  //   populate: "*",
  // };
  const queryParams: Record<string, any> = {
    "populate[brand]": true,
    "populate[category]": true,
    "populate[special_offers]": true,
    "populate[ImageURL]": true,
    "populate[product_colors]": true,
    "populate[specification_values][populate]": "specification_type",
  };

  // Add filters if they exist
  if (filters?.specialOffer) {
    queryParams["filters[special_offers][$null]"] = false;
  }
  if (filters?.categoryId) {
    queryParams["filters[category][documentId][$eq]"] = filters.categoryId; // ✅ correct
  }
  if (filters?.brandId) {
    queryParams["filters[brand][id]"] = filters.brandId;
  }

  const res = await apiClient<any>(
    "/products",
    { cache: "force-cache" },
    queryParams,
    locale
  );

  return res.data.map((category: any) => productAdapter.adapt(category));
};
