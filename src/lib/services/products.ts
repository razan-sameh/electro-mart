import { ProductAdapter } from "@/adapters/ProductAdapter";
import { apiClient } from "../apiClient";
import { typProductFilters, typProduct } from "@/content/types";
import { notFound } from "next/navigation";

const productAdapter = ProductAdapter.getInstance();

export const fetchProducts = async (
  locale: string,
  filters?: typProductFilters,
  search?: string,
  limit?: number,
  page?: number,
  pageSize?: number
): Promise<{ data: typProduct[]; meta: any }> => {
  const queryParams: Record<string, any> = {
    "populate[brand]": true,
    "populate[category]": true,
    "populate[special_offers]": true,
    "populate[ImageURL]": true,
    "populate[product_colors]": true,
    "populate[specification_values][populate]": "specification_type",
    "pagination[page]": page, // ← add page
    "pagination[pageSize]": pageSize, // ← add pageSize
    "pagination[withCount]": true, // ← get total count
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
        `filters[$and][${index}][specification_values][documentId][$eq]`
      ] = id;
    });
  }

  // ✅ Color
  if (filters?.colorsId?.length) {
    filters.colorsId.forEach((id, index) => {
      queryParams[`filters[$or][${index}][product_colors][documentId][$eq]`] =
        id;
    });
  }
  if (filters?.brandsId?.length) {
    filters.brandsId.forEach((id, index) => {
      queryParams[`filters[$or][${index}][brand][documentId][$eq]`] = id;
    });
  }

  // ✅ Price
  if (filters?.price) {
    queryParams["filters[Price][$lte]"] = filters.price;
  }

  // ✅ Search filter
  if (search && search.trim() !== "") {
    queryParams["filters[Name][$containsi]"] = search.trim();
  }

  if (limit) {
    queryParams["pagination[limit]"] = limit;
  }

  if (page !== undefined && pageSize !== undefined) {
    queryParams["pagination[page]"] = page;
    queryParams["pagination[pageSize]"] = pageSize;
    queryParams["pagination[withCount]"] = true;
  }
  const res = await apiClient<any>("/products", {}, queryParams, locale);
  if (!res.data) {
    notFound();
  }
  return {
    data: res.data.map((product: any) => productAdapter.adapt(product)),
    meta: res.meta.pagination,
  };
};

export const fetchProductById = async (locale: string, productId: string) => {
  const queryParams: Record<string, any> = {
    "populate[brand]": true,
    "populate[category]": true,
    "populate[special_offers]": true,
    "populate[ImageURL]": true,
    "populate[product_colors]": true,
    "populate[specification_values][populate]": "specification_type",
  };

  const res = await apiClient<any>(
    `/products/${productId}`,
    {},
    queryParams,
    locale
  );

  if (!res.data) {
    notFound();
  }

  return productAdapter.adapt(res.data);
};

export const getMinPrice = async (locale: string, categoryId?: string) => {
  const queryParams: Record<string, any> = {
    sort: "Price:asc",
    "pagination[limit]": 1,
    "populate[category]": true,
  };
  if (categoryId) {
    queryParams["filters[category][documentId][$eq]"] = categoryId;
  }

  const res = await apiClient<any>("/products", {}, queryParams, locale);
  if (!res.data) {
    notFound();
  }
  return res.data[0]?.Price || 0;
};

export const getMaxPrice = async (locale: string, categoryId?: string) => {
  const queryParams: Record<string, any> = {
    sort: "Price:desc",
    pagination: { limit: 1 },
    locale,
  };

  if (categoryId) {
    queryParams["filters[category][documentId][$eq]"] = categoryId;
  }

  const res = await apiClient<any>("/products", {}, queryParams, locale);
  if (!res.data) {
    notFound();
  }
  return res.data[0]?.Price || 0;
};

export const fetchSimilarProducts = async (
  locale: string,
  productId: string,
  categoryId: string,
  brandId?: string,
  limit: number = 5
) => {
  const queryParams: Record<string, any> = {
    "filters[category][documentId][$eq]": categoryId,
    "filters[documentId][$ne]": productId, // exclude current product
    "populate[category]": true,
    "populate[special_offers]": true,
    "populate[brand]": true,
    "populate[ImageURL]": true,
    "populate[product_colors]": true,
    "pagination[limit]": limit,
  };

  if (brandId) {
    queryParams["filters[brand][documentId][$eq]"] = brandId;
  }

  const res = await apiClient<any>("/products", {}, queryParams, locale);
  if (!res.data) {
    notFound();
  }
  return res.data.map((p: any) => productAdapter.adapt(p));
};
