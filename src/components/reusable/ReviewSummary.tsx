"use client";

import { useRouter } from "@/i18n/navigation";
import { StarRating } from "@/components/reusable/StarRating";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import { useReviews } from "@/lib/hooks/useReview";

interface ReviewSummaryProps {
  productId: number;
}

export default function ReviewSummary({ productId }: ReviewSummaryProps) {
  const t = useTranslations("ProductDetails");
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const { ratingSummary, isLoadingSummary } = useReviews(productId);

  const handleCreateReview = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${productId}/reviews/create`);
    } else {
      router.push(`/products/${productId}/reviews/create`);
    }
  };

  return (
    <div className="lg:w-1/4 p-4 border border-lightGray rounded-lg">
      <h2 className="text-lg font-semibold mb-2 text-center">
        {t("customerReviews")}
      </h2>

      <div className="flex items-center justify-center mb-4">
        <StarRating rating={ratingSummary?.avg_rating ?? 0} size={18} />
      </div>

      <p className="text-center text-sm text-gray-500 mb-4">
        {ratingSummary?.reviews_count ?? 0} {t("reviews")}
      </p>

      {/* Star breakdown */}
      <div className="space-y-2">
        {isLoadingSummary ? (
          <div className="animate-pulse space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="w-10 text-sm">{star} ★</span>
                <div className="flex-1 bg-gray-200 h-3 rounded" />
                <span className="w-10 text-sm text-right">0%</span>
              </div>
            ))}
          </div>
        ) : (
          ratingSummary?.breakdown?.map(
            (row: { star: number; count: number }) => {
              const percentage = ratingSummary.reviews_count
                ? (row.count / ratingSummary.reviews_count) * 100
                : 0;
              return (
                <div key={row.star} className="flex items-center gap-2">
                  <span className="w-10 text-sm">{row.star} ★</span>
                  <div className="flex-1 bg-gray-200 h-3 rounded">
                    <div
                      className="bg-secondary h-3 rounded"
                      style={{ width: `${percentage.toFixed(0)}%` }}
                    />
                  </div>
                  <span className="w-10 text-sm text-right">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              );
            },
          )
        )}
      </div>

      <p className="py-8 text-start">{t("shareFeedback")}</p>

      <button
        onClick={handleCreateReview}
        className="w-full flex justify-center py-3 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition"
      >
        {t("writeReview")}
      </button>
    </div>
  );
}
