import { ReviewAdapter } from "@/adapters/ReviewAdapter";
import { apiClient, STRAPI_URL } from "../apiClient";
import { typReview } from "@/content/types";

const reviewAdapter = ReviewAdapter.getInstance(STRAPI_URL);

export const fetchReviewsByProductId = async (
  productId: string,
  page: number = 1,
  pageSize: number = 10,
  searchComment?: string,
  ratingFilter?: number
): Promise<{ data: typReview[]; meta: any }> => {
  const queryParams: Record<string, any> = {
    "filters[product][documentId][$eq]": productId,
    populate: "user",
    "pagination[page]": page,
    "pagination[pageSize]": pageSize,
    "sort": "createdAt:desc"
  };

  // Optional filters
  if (searchComment && searchComment.trim()) {
    queryParams["filters[Comment][$containsi]"] = searchComment;
  }

  if (ratingFilter !== undefined && ratingFilter !== null) {
    queryParams["filters[Rating][$eq]"] = ratingFilter;
  }
  const res = await apiClient<any>("/reviews", {}, queryParams);

  if (!res.data) {
    return { data: [], meta: 0 };
  }

  return {
    data: res.data.map((review: any) => reviewAdapter.adapt(review)),
    meta: res.meta.pagination,
  };
};

export const createReview = async (
  productId: string,
  rating: number,
  comment: string
): Promise<typReview> => {
  const res = await fetch("/api/review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      rating,
      comment,
      productId,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Create review failed:", errorData);
    throw new Error(errorData.error || "Failed to create review");
  }

  const data = await res.json();

  // ✅ Adapt the response if needed
  return reviewAdapter.adapt(data);
};
