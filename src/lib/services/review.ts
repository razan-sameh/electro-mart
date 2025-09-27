import { ReviewAdapter } from "@/adapters/ReviewAdapter";
import { apiClient, STRAPI_URL } from "../apiClient";
import { typReview } from "@/content/types";

export type AddReviewInput = {
  productId: string;
  userId: string;
  rating: number;
  comment: string;
};
const reviewAdapter = ReviewAdapter.getInstance(STRAPI_URL);

export const fetchReviewsByProductId = async (
  locale: string,
  productId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<{ data: typReview[]; meta: any }> => {
  const queryParams: Record<string, any> = {
    "filters[product][documentId][$eq]": productId,
    "populate[users_permissions_user]": true,
    "pagination[page]": page,
    "pagination[pageSize]": pageSize,
    "sort[0]": "createdAt:desc", // newest first
  };

  const res = await apiClient<any>("/reviews", {}, queryParams, locale);

  if (!res.data) {
    return { data: [], meta: 0 };
  }

  return {
    data: res.data.map((review: any) => reviewAdapter.adapt(review)),
    meta: res.meta.pagination,
  };
};

export const addReviewToProduct = async (input: AddReviewInput): Promise<typReview> => {
  // POST review
  const res = await apiClient<{ data: typReview }>(
    "/reviews",
    {
      method: "POST",
      body: JSON.stringify({
        data: {
          rating: input.rating,
          comment: input.comment,
          product: input.productId,
          user: input.userId,
        },
      }),
    }
  );

  return res.data;
};
