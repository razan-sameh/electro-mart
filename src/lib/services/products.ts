import { ProductAdapter } from "@/adapters/ProductAdapter";
import {
  typProduct,
  typProductFilters,
  typSidebarFilters,
} from "@/content/types";
import { notFound } from "next/navigation";
import supabase from "../supabase";

const productAdapter = ProductAdapter.getInstance();

export async function fetchProducts(
  locale: string,
  filters: typProductFilters = {},
  search?: string,
  pageSize = 10,
  page = 1
): Promise<{ data: typProduct[]; meta: any } | null> {
  const {
    categoryId,
    brandIds = [],
    attributes = [],
    specs = [],
    minPrice,
    maxPrice,
    hasOffer = null,
  } = filters;

  const { data, error } = await supabase.rpc(
    "get_products_advanced_paginated",
    {
      locale,
      page,
      page_size: pageSize,
      category_filter: categoryId ?? null,
      brand_filter: brandIds,
      attribute_filters: attributes,
      spec_filters: specs,
      min_price: minPrice,
      max_price: maxPrice,
      search: search ?? null,
      has_offer: hasOffer,
    }
  );

  if (error) {
    console.error("Error fetching products:", error);
    return null;
  }

  if (!data || !data.data || data.data.length === 0) {
    return { data: [], meta: data?.meta ?? {} };
  }

  return {
    data: data.data.map((product: any) => productAdapter.adapt(product)),
    meta: data.meta,
  };
}

export async function fetchProductById(productId: number, locale: string) {
  const { data, error } = await supabase.rpc("get_product_by_id", {
    p_id: productId,
    locale,
  });

  if (error) {
    console.error(error);
    return null;
  }
console.log({data});

  if (!data) {
    notFound();
  }

  return productAdapter.adapt(data);
}

export const fetchSimilarProducts = async (
  locale: string,
  productId: number,
  categoryId: number,
  limit: number = 5
) => {
  const { data, error } = await supabase.rpc("get_similar_products", {
    current_product_id: productId,
    categoryid: categoryId,
    locale: locale,
    limit_count: limit,
  });


  if (error) {
    console.error(error);
    return null;
  }

  if (!data) {
    notFound();
  }

  return data.data.map((p: any) => productAdapter.adapt(p));
};

export const fetchProductsByCategoryName = async (
  locale: string,
  categoryName: string,
  limit: number
) => {
  const { data, error } = await supabase.rpc("get_products_by_category_name", {
    category_name: categoryName,
    locale: locale,
    limit_count: limit,
  });

  if (error) {
    console.error(error);
    return null;
  }

  if (!data) {
    notFound();
  }

  return data.data.map((p: any) => productAdapter.adapt(p));
};

export async function fetchSidebarFilters(
  locale: string
): Promise<typSidebarFilters> {
  const { data, error } = await supabase.rpc("get_sidebar_filters", {
    locale: locale,
  });

  if (error) {
    console.error(error);
    throw error;
  }

  if (!data) {
    notFound();
  }

  return (
    data ?? {
      categories: [],
      brands: [],
      specs: [],
      attributes: [],
      price_range: { min: 0, max: 0 },
    }
  );
}
