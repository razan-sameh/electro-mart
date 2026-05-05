import { ReviewAdapter } from "@/adapters/ReviewAdapter";
import supabase from "../supabase";

const reviewAdapter = ReviewAdapter.getInstance();

export async function fetchProductRatingSummary(productId: number) {
  const { data, error } = await supabase.rpc("get_product_rating_summary", {
    p_product_id: productId,
  });

  if (error) {
    console.error("Error fetching rating summary:", error);
    return null;
  }

  return data;
}

export const fetchReviewsByProductId = async (
  productId: number,
  locale: string,
  page: number = 1,
  pageSize: number = 10,
  searchComment?: string,
  ratingFilter?: number,
  variantId?: number,
) => {
  const { data, error } = await supabase.rpc("get_product_reviews", {
    p_product_id: productId,
    p_locale: locale,
    p_page: page,
    p_page_size: pageSize,
    p_search: searchComment ?? null,
    p_rating: ratingFilter ?? null,
    p_variant_id: variantId ?? null,
  });

  if (error) throw new Error(error.message || "Failed to fetch reviews");

  return {
    data: (data?.data || []).map((r: any) => reviewAdapter.adapt(r)),
    meta: data?.meta || {},
  };
};

export const createReview = async (payload: {
  productId: number;
  productVariantId: number;
  rating: number;
  comment: string;
}) => {
  const res = await fetch("/api/review", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Failed to create review");
  }

  return data;
};
