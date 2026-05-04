"use client";

import Pagination from "@/components/reusable/Pagination";
import ReviewCard from "@/components/reusable/ReviewCard";
import ReviewSummary from "@/components/reusable/ReviewSummary";
import { typReview } from "@/content/types";
import { useProductsById } from "@/lib/hooks/useProducts";
import { useReviews } from "@/lib/hooks/useReview";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ReviewsDetailsProps {
  productId: number;
}

export default function ReviewsDetails({ productId }: ReviewsDetailsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("ReviewDetails");

  const pageParam = parseInt(searchParams.get("page") || "1");
  const searchParam = searchParams.get("search") || "";
  const ratingParam = searchParams.get("rating")
    ? parseInt(searchParams.get("rating")!)
    : undefined;
  const variantParam = searchParams.get("variant")
    ? parseInt(searchParams.get("variant")!)
    : undefined;

  const [searchText, setSearchText] = useState(searchParam);
  const [selectedRating, setSelectedRating] = useState<number | null>(
    ratingParam ?? null,
  );
  const [selectedVariant, setSelectedVariant] = useState<number | null>(
    variantParam ?? null,
  );

  const pageSize = 18;

  const { data: product, isFetching: isProductFetching } =
    useProductsById(productId);
  const { reviews, meta, isFetching } = useReviews(productId, pageSize);

  if (isProductFetching) return <LoadingSpinner />;

  const updateUrl = (
    newPage = pageParam,
    newSearch = searchText,
    newRating = selectedRating,
    newVariant = selectedVariant,
  ) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set("page", newPage.toString());
    if (newSearch) params.set("search", newSearch);
    if (newRating) params.set("rating", newRating.toString());
    if (newVariant) params.set("variant", newVariant.toString());
    router.push(`?${params.toString()}`);
  };

  const handleSearch = () =>
    updateUrl(1, searchText, selectedRating, selectedVariant);

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rawValue = parseInt(e.target.value);
    const value = rawValue === 0 ? null : rawValue;
    setSelectedRating(value);
    updateUrl(1, searchText, value, selectedVariant);
  };

  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rawValue = parseInt(e.target.value);
    const value = rawValue === 0 ? null : rawValue;
    setSelectedVariant(value);
    updateUrl(1, searchText, selectedRating, value);
  };

  const handlePageChange = (page: number) =>
    updateUrl(page, searchText, selectedRating, selectedVariant);

  const getVariantLabel = (variant: any) =>
    variant.attributes
      ?.map((a: any) => `${a.attribute}: ${a.value}`)
      .join(" | ") || variant.sku;

  return (
    <div className="min-h-screen">
      {/* Product Header */}
      <div className="flex flex-col lg:flex-row gap-12 py-8 items-start">
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 w-full">
          <img
            src={product?.imagesUrl[0]?.url}
            alt="Product image"
            className="w-100 h-100 object-contain"
          />
          <div className="flex flex-col gap-2">
            <p className="text-sm sm:text-base font-semibold">
              {product?.name}
            </p>
            <p className="text-sm sm:text-base font-medium">
              {product?.description}
            </p>
          </div>
        </div>
        <ReviewSummary productId={productId} />
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

        {/* Rating Filter */}
        <select
          className="border bg-body border-lightGray px-3 py-2 rounded w-full sm:w-auto"
          value={selectedRating ?? 0}
          onChange={handleRatingChange}
        >
          <option value={0}>{t("allStars")}</option>
          <option value={5}>5 {t("stars")}</option>
          <option value={4}>4 {t("stars")}</option>
          <option value={3}>3 {t("stars")}</option>
          <option value={2}>2 {t("stars")}</option>
          <option value={1}>1 {t("star")}</option>
        </select>

        {/* Variant Filter */}
        <select
          className="border bg-body border-lightGray px-3 py-2 rounded w-full sm:w-auto"
          value={selectedVariant ?? 0}
          onChange={handleVariantChange}
        >
          <option value={0}>{t("allVariants")}</option>
          {product?.variants?.map((variant: any) => (
            <option key={variant.id} value={variant.id}>
              {getVariantLabel(variant)}
            </option>
          ))}
        </select>
      </div>

      {/* Reviews */}
      <div className="space-y-4 pb-8">
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
