"use client";
import { typReview } from "@/content/types";
import { useTranslations } from "next-intl";
import { useReviews } from "@/lib/hooks/useReview";
import SectionHeader from "@/components/reusable/SectionHeader";
import ReviewSummary from "@/components/reusable/ReviewSummary";
import ReviewCard from "@/components/reusable/ReviewCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Props {
  productId: number;
}

export default function ProductReviews({ productId }: Props) {
  const { reviews, isFetching } = useReviews(productId, 3, true);
  const t = useTranslations("ProductDetails");

  return (
    <div className="mt-12">
      <SectionHeader
        title={t("reviewsHaeder")}
        linkText={t("viewAll")}
        linkHref={`/products/${productId}/reviews`}
      />
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <ReviewSummary productId={productId} />

        {/* Right Reviews */}
        <div className="flex-1 space-y-4">
          {isFetching ? (
            <LoadingSpinner />
          ) : reviews.length === 0 ? (
            <p className="text-gray-500">{t("noReviews")}</p>
          ) : (
            reviews.map((review: typReview) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
