"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { typReview } from "@/content/types";
import { createReview, fetchReviewsByProductId } from "../services/review";
import { v4 as uuidv4 } from "uuid";
import { useSearchParams } from "next/navigation";

type CreateReviewInput = {
  productId: number;
  productVariantId: number;
  orderItemId: number;
  rating: number;
  comment: string;
};

export function useReviews(productId: number, pageSize: number = 10) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const searchComment = searchParams.get("search") || undefined;
  const ratingFilter = searchParams.get("rating")
    ? parseInt(searchParams.get("rating")!)
    : undefined;

  const queryKey = [
    "reviews",
    productId,
    page,
    pageSize,
    searchComment,
    ratingFilter,
  ];

  // =========================
  // FETCH REVIEWS
  // =========================
  const reviewsQuery = useQuery({
    queryKey,
    queryFn: () =>
      fetchReviewsByProductId(
        productId,
        page,
        pageSize,
        searchComment,
        ratingFilter,
      ),
    enabled: !!productId,
    retry: 1,
    staleTime: 10 * 60 * 1000,
  });

  // =========================
  // CREATE REVIEW
  // =========================
  const createMutation = useMutation({
    mutationFn: (payload: CreateReviewInput) => createReview(payload),

    onMutate: async (newReview) => {
      await queryClient.cancelQueries({ queryKey });

      const previousReviews = queryClient.getQueryData<any>(queryKey);

      const optimisticId = uuidv4();

      const optimisticReview: typReview = {
        id: 0,
        documentId: optimisticId,
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as typReview;

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: [optimisticReview, ...old.data],
          meta: {
            ...old.meta,
            total: (old.meta?.total || 0) + 1,
          },
        };
      });

      return { previousReviews, optimisticId };
    },

    onSuccess: (data, variables, context) => {
      if (!context) return;

      const { optimisticId } = context;

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        const updated = old.data.map((review: typReview) =>
          review.documentId === optimisticId
            ? { ...review, id: data.id }
            : review,
        );

        return {
          ...old,
          data: updated,
        };
      });

      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    },

    onError: (_err, _vars, context) => {
      if (context?.previousReviews) {
        queryClient.setQueryData(queryKey, context.previousReviews);
      }
    },
  });

  return {
    reviews: reviewsQuery.data?.data || [],
    meta: reviewsQuery.data?.meta,
    isLoading: reviewsQuery.isLoading,
    isError: reviewsQuery.isError,
    error: reviewsQuery.error,
    refetch: reviewsQuery.refetch,
    isFetching: reviewsQuery.isFetching,

    createReview: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
}
