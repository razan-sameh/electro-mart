"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { typReview } from "@/content/types";
import { createReview, fetchReviewsByProductId } from "../services/review";
import { v4 as uuidv4 } from "uuid";
import { useSearchParams } from "next/navigation";

type CreateReviewInput = {
  productId: string;
  rating: number;
  comment: string;
};

export function useReviews(productId: string, pageSize: number = 10) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  // Get page, search, rating from URL
  const page = parseInt(searchParams.get("page") || "1");
  const searchComment = searchParams.get("search") || undefined;
  const ratingFilter = searchParams.get("rating")
    ? parseInt(searchParams.get("rating")!)
    : undefined;

  const reviewsQuery = useQuery<{ data: typReview[]; meta: any }>({
    queryKey: [
      "reviews",
      productId,
      page,
      pageSize,
      searchComment,
      ratingFilter,
    ],
    queryFn: () =>
      fetchReviewsByProductId(
        productId,
        page,
        pageSize,
        searchComment,
        ratingFilter
      ),
    enabled: !!productId,
    retry: 1, // 👈 Avoid infinite retry loops
    staleTime: 10 * 60 * 1000, // 👈 10 minutes
  });

  // ➕ Create review
  const createMutation = useMutation({
    mutationFn: ({ productId, rating, comment }: CreateReviewInput) =>
      createReview(productId, rating, comment),

    onMutate: async (data) => {
      // Cancel current review queries
      await queryClient.cancelQueries({
        queryKey: ["reviews", data.productId, page, pageSize],
      });

      // Snapshot before optimistic update
      const previousReviews = queryClient.getQueryData<{
        data: typReview[];
        meta: any;
      }>(["reviews", data.productId, page, pageSize]);

      // Optimistic review structure
      const optimisticReview: typReview = {
        id: Date.now(), // temporary ID
        documentId: uuidv4(),
        rating: data.rating,
        comment: data.comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Add any other required fields from typReview with defaults
      } as typReview;

      // Insert optimistic review at the top
      if (previousReviews) {
        queryClient.setQueryData(["reviews", data.productId, page, pageSize], {
          ...previousReviews,
          data: [optimisticReview, ...previousReviews.data],
          meta: {
            ...previousReviews.meta,
            total: previousReviews.meta.total + 1,
          },
        });
      }

      return { previousReviews };
    },

    onSuccess: (data, variables) => {
      const { productId } = variables;

      // Replace optimistic review with real server data
      queryClient.setQueryData<{ data: typReview[]; meta: any }>(
        ["reviews", productId, page, pageSize],
        (old) => {
          if (!old) return old;

          // Find and replace the optimistic review
          const newData = old.data.map((review) =>
            review.id === data.id ? data : review
          );

          // If the new review isn't found (shouldn't happen), add it
          const reviewExists = newData.some((r) => r.id === data.id);
          if (!reviewExists) {
            newData.unshift(data);
          }

          return {
            ...old,
            data: newData,
          };
        }
      );

      // Refresh product stats (averageRating + totalReviews)
      queryClient.invalidateQueries({
        queryKey: ["product", productId],
      });

      // Invalidate all review pages for this product
      queryClient.invalidateQueries({
        queryKey: ["reviews", productId],
      });
    },

    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousReviews) {
        queryClient.setQueryData(
          ["reviews", _variables.productId, page, pageSize],
          context.previousReviews
        );
      }
    },
  });

  return {
    // Query data
    reviews: reviewsQuery.data?.data || [],
    meta: reviewsQuery.data?.meta,
    isLoading: reviewsQuery.isLoading,
    isError: reviewsQuery.isError,
    error: reviewsQuery.error,
    refetch: reviewsQuery.refetch,
    isFetching: reviewsQuery.isFetching,

    // Actions
    createReview: createMutation.mutateAsync,

    // Mutation states
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
}
