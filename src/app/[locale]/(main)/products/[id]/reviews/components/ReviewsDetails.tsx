"use client";

import Pagination from "@/components/reusable/Pagination";
import ReviewCard from "@/components/reusable/ReviewCard";
import ReviewSummary from "@/components/reusable/ReviewSummary";
import { RatingBreakdown, typReview } from "@/content/types";
import { getRatingTable } from "@/content/utils";
import { useProductsById } from "@/lib/hooks/useProducts";
import { useReviews } from "@/lib/hooks/useReview";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ReviewsDetailsProps {
  productId: string;
}

export default function ReviewsDetails({ productId }: ReviewsDetailsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("ReviewDetails");
  // Read from URL or use defaults
  const pageParam = parseInt(searchParams.get("page") || "1");
  const searchParam = searchParams.get("search") || "";
  const ratingParam = searchParams.get("rating")
    ? parseInt(searchParams.get("rating")!)
    : undefined;

  // Temporary local state for controlled input/select
  const [searchText, setSearchText] = useState(searchParam);
  const [selectedRating, setSelectedRating] = useState<number | undefined>(
    ratingParam
  );

  const pageSize = 18;

  const { data: product ,isFetching:isProductFetching } = useProductsById(productId);

  // useReviews reads page, search, rating directly from URL
  const { reviews, meta, isFetching } = useReviews(productId, pageSize);

  const breakdown: RatingBreakdown[] = getRatingTable(reviews!);

  if (!reviews) return <p>Loading...</p>;

  // Update URL function
  const updateUrl = (
    newPage = pageParam,
    newSearch = searchText,
    newRating = selectedRating
  ) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set("page", newPage.toString());
    if (newSearch) params.set("search", newSearch);
    if (newRating) params.set("rating", newRating.toString());

    router.push(`?${params.toString()}`);
  };

  // Search handler: updates URL only when button clicked or Enter pressed
  const handleSearch = () => {
    updateUrl(1, searchText, selectedRating);
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setSelectedRating(value);
    updateUrl(1, searchText, value);
  };

  const handlePageChange = (page: number) => {
    updateUrl(page, searchText, selectedRating);
  };
  if (isProductFetching) return <LoadingSpinner/>;

  return (
    <div className="min-h-screen">
      {/* Product Header */}
      <div className="flex flex-col lg:flex-row gap-12 py-8 items-start">
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 w-full">
          <img
            src={product.imagesUrl[0]}
            alt="Product image"
            className="w-100 h-100 object-contain"
          />
          <div className="flex flex-col gap-2">
            <p className="text-sm sm:text-base font-semibold">{product.name}</p>
            <p className="text-sm sm:text-base font-medium">
              {product.description}
            </p>
          </div>
        </div>

        <ReviewSummary
          averageRating={product.averageRating}
          breakdown={breakdown}
          productId={productId}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col pb-8 sm:flex-row flex-wrap gap-4 items-start sm:items-center">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          className="border border-lightGray rounded px-3 py-2 w-full sm:w-64"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/85 transition"
          onClick={handleSearch}
        >
          {t("searchButton")}
        </button>

        <select
          className="border bg-body border-lightGray px-3 py-2 rounded w-full sm:w-auto"
          value={selectedRating ?? ""}
          onChange={handleRatingChange}
        >
          <option value={0}>{t("allStars")}</option>
          <option value={5}>5 {t("stars")}</option>
          <option value={4}>4 {t("stars")}</option>
          <option value={3}>3 {t("stars")}</option>
          <option value={2}>2 {t("stars")}</option>
          <option value={1}>1 {t("star")}</option>
        </select>
      </div>

      {/* Reviews */}
      <div className="space-y-4 pb-8">
        {isFetching ? (
          <LoadingSpinner/>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500">{t("noReviews")}</p>
        ) : (
          reviews.map((review: typReview) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-auto">
        {meta?.total > pageSize && (
          <Pagination
            setPaginate={handlePageChange}
            currentPage={pageParam}
            pageSize={pageSize}
            itemsLength={meta?.total || 0}
          />
        )}
      </div>
    </div>
  );
}
