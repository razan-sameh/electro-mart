"use client";

import { RatingBreakdown } from "@/content/types";
import { Link, useRouter } from "@/i18n/navigation";
import { StarRating } from "@/components/reusable/StarRating";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/hooks/useAuth";

interface ReviewSummaryProps {
  averageRating: number;
  breakdown: RatingBreakdown[];
  productId: string;
}

export default function ReviewSummary({
  averageRating,
  breakdown,
  productId,
}: ReviewSummaryProps) {
  const t = useTranslations("ProductDetails");
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleCreateReview = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${productId}`);
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
        <StarRating rating={averageRating} size={18} />
      </div>

      {/* Star breakdown */}
      <div className="space-y-2">
        {breakdown.map((row) => (
          <div key={row.star} className="flex items-center gap-2">
            <span className="w-10 text-sm">{row.star} ★</span>
            <div className="flex-1 bg-gray-200 h-3 rounded">
              <div
                className="bg-secondary h-3 rounded"
                style={{ width: `${row.percentage.toFixed(0)}%` }}
              />
            </div>
            <span className="w-10 text-sm text-right">
              {row.percentage.toFixed(0)}%
            </span>
          </div>
        ))}
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
