import { ProductAdapter } from "@/adapters/ProductAdapter";
import { apiClient, STRAPI_URL } from "../apiClient";
import { typProductFilters, typProduct } from "@/content/types";

const productAdapter = ProductAdapter.getInstance(STRAPI_URL);

export const getProducts = async (
  locale: string,
  filters?: typProductFilters
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
  // ✅ Brand
  if (filters?.brandId) {
    queryParams["filters[brand][documentId][$eq]"] = filters.brandId;
  }

  if (filters?.specificationValuesId?.length) {
    filters.specificationValuesId.forEach((id, index) => {
      queryParams[
        `filters[$or][${index}][specification_values][documentId][$eq]`
      ] = id;
    });
  }

  
  // ✅ Color
    if (filters?.colorsId?.length) {
    filters.colorsId.forEach((id, index) => {
      queryParams[
        `filters[$or][${index}][product_colors][documentId][$eq]`
      ] = id;
    });
  }

  // ✅ Price
  if (filters?.price) {
    queryParams["filters[Price][$lte]"] = filters.price;
  }

  const res = await apiClient<any>("/products", {}, queryParams, locale);

  return res.data.map((category: any) => productAdapter.adapt(category));
};
