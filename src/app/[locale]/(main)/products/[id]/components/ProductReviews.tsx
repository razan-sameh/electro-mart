"use client";
import { RatingBreakdown, typReview } from "@/content/types";
import { getRatingTable } from "@/content/utils";
import { useTranslations } from "next-intl";
import { useReviews } from "@/lib/hooks/useReview";
import SectionHeader from "@/components/reusable/SectionHeader";
import ReviewSummary from "@/components/reusable/ReviewSummary";
import ReviewCard from "@/components/reusable/ReviewCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Props {
  averageRating: number;
  productId: string;
}

export default function ProductReviews({ averageRating, productId }: Props) {
  const { reviews, isFetching } = useReviews(productId);
  const breakdown: RatingBreakdown[] = getRatingTable(reviews!);
  const t = useTranslations("ProductDetails");
  if (isFetching) return <LoadingSpinner />;

  return (
    <div className="mt-12">
      <SectionHeader
        title={t("reviewsHaeder")}
        linkText={t("viewAll")}
        linkHref={`/products/${productId}/reviews`}
      />
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <ReviewSummary
          averageRating={averageRating}
          breakdown={breakdown}
          productId={productId}
        />

        {/* Right Reviews */}
        <div className="flex-1 space-y-4">
          {reviews?.length === 0 ? (
            <p className="text-gray-500">{t("noReviews")}</p>
          ) : (
            reviews
              .slice(0, 3)
              .map((review: typReview) => (
                <ReviewCard key={review.id} review={review} />
              ))
          )}
        </div>
      </div>
    </div>
  );
}
