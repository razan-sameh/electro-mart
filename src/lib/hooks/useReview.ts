import {
  useMutation,
  UseMutationResult,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { typProduct, typReview } from "@/content/types";
import { AddReviewInput, addReviewToProduct, fetchReviewsByProductId } from "../services/review";
import { v4 as uuidv4 } from 'uuid';
import { useLocale } from "next-intl";


export function useReviewsByProductId(productId: string, page: number = 1, pageSize: number = 10) {
  const locale = useLocale();

  return useSuspenseQuery({
    queryKey: ["reviews", locale, productId, page, pageSize],
    queryFn: () => fetchReviewsByProductId(locale, productId, page, pageSize),
  });
}

export const useAddReview = (): UseMutationResult<
  typReview,
  Error,
  AddReviewInput,
  () => void
> => {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: addReviewToProduct,

    onMutate: async (data) => {
      const page = 1;
      const pageSize = 10;

      // Cancel outgoing review queries
      await queryClient.cancelQueries({
        queryKey: ["reviews", locale, data.productId, page, pageSize],
      });

      // Snapshot previous reviews
      const previousReviews = queryClient.getQueryData<{
        data: typReview[];
        meta: any;
      }>(["reviews", locale, data.productId, page, pageSize]);

      // Optimistic new review
      const newReview: typReview = {
        id: uuidv4(),
        rating: data.rating,
        comment: data.comment,
        user: { id: data.userId, username: "You", email: "" },
      };

      if (previousReviews) {
        queryClient.setQueryData(["reviews", locale, data.productId, page, pageSize], {
          ...previousReviews,
          data: [newReview, ...previousReviews.data],
          meta: {
            ...previousReviews.meta,
            total: previousReviews.meta.total + 1,
          },
        });
      }

      // Return rollback function
      return () => {
        queryClient.setQueryData(
          ["reviews", locale, data.productId, page, pageSize],
          previousReviews
        );
      };
    },

    onError: (_error, _data, rollback) => {
      if (rollback) rollback();
    },

    onSuccess: (_data, variables) => {
      // Invalidate product to refresh averageRating & totalReviews
      queryClient.invalidateQueries({
        queryKey: ["product", locale, variables.productId],
      });

      // Invalidate reviews to sync with server
      queryClient.invalidateQueries({
        queryKey: ["reviews", locale, variables.productId],
      });
    },
  });
};
