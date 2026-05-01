import { ReviewAdapter } from "@/adapters/ReviewAdapter";

const reviewAdapter = ReviewAdapter.getInstance();

export const fetchReviewsByProductId = async (
  productId: number,
  page: number = 1,
  pageSize: number = 10,
  searchComment?: string,
  ratingFilter?: number,
) => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (searchComment) params.append("search", searchComment);
  if (ratingFilter !== undefined) params.append("rating", String(ratingFilter));

  const res = await fetch(`/api/review/${productId}?${params.toString()}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Failed to fetch reviews");
  }

  return {
    data: (data?.data || []).map((r: any) => reviewAdapter.adapt(r)),
    meta: data?.meta || {},
  };
};

export const createReview = async (payload: {
  productId: number;
  productVariantId: number;
  orderItemId: number;
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
