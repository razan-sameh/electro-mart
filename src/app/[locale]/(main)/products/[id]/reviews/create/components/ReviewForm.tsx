"use client";

import { useProductsById } from "@/lib/hooks/useProducts";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaStar, FaInfoCircle, FaPen } from "react-icons/fa";
import { reviewSchema, ReviewSchemaType } from "./schema";
import { useReviews } from "@/lib/hooks/useReview";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import toast from "react-hot-toast";

interface ReviewFormProps {
  productId: number;
}

export default function ReviewForm({ productId }: ReviewFormProps) {
  const { data: product, isFetching } = useProductsById(productId);
  const { createReview } = useReviews(productId);
  const router = useRouter();
  const t = useTranslations("Review");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ReviewSchemaType>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      review: "",
      variantId: 0,
    },
  });

  // remove selectedVariantId state, use form value instead
  const variantId = watch("variantId");

  const rating = watch("rating");
  const review = watch("review");

  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null,
  );

  const getVariantLabel = (variant: any) => {
    return variant.attributes
      .map((a: any) => `${a.attribute}: ${a.value}`)
      .join(" | ");
  };

  const onSubmit = async (data: ReviewSchemaType) => {
    try {
      await createReview({
        productId,
        productVariantId: data.variantId,
        rating: data.rating,
        comment: data.review,
      });
      toast.success(t("reviewSubmitted"));
      reset();
      router.back();
    } catch (err: any) {
      toast.error(err.message || t("updatingError"));
    }
  };

  const handleCancel = () => {
    reset();
    router.back();
  };

  if (isFetching) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-body flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-background rounded-2xl shadow-lg w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-lightGray/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-lightGray/20 rounded-lg flex items-center justify-center">
              <FaStar className="w-5 h-5 text-icon/20" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{t("rateProduct")}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {t("provideFeedback")}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Rating Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <label className="text-sm font-medium">{t("yourRating")}</label>
              <FaInfoCircle className="w-4 h-4" />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setValue("rating", star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="w-14 h-14 bg-lightGray/20 hover:bg-lightGray/30 rounded-xl flex items-center justify-center transition-colors"
                >
                  <FaStar
                    className={`w-7 h-7 ${
                      star <= (hoveredRating || rating)
                        ? "fill-secondary"
                        : "text-icon/20"
                    }`}
                  />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">
                {errors.rating.message}
              </p>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              {t("productName")}
            </label>
            <div className="w-full px-4 py-3 bg-lightGray/20 border border-gray-200 rounded-xl text-gray-700">
              {product?.name}
            </div>
          </div>

          {/* Variant Selector */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              {t("selectVariant")}
            </label>
            <select
              className="w-full px-4 py-3 bg-lightGray/20 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={variantId || ""}
              onChange={(e) =>
                setValue("variantId", Number(e.target.value), {
                  shouldValidate: true,
                })
              }
            >
              <option value="">{t("chooseVariant")}</option>
              {product?.variants?.map((variant: any) => (
                <option key={variant.id} value={variant.id}>
                  {getVariantLabel(variant)}
                </option>
              ))}
            </select>
            {errors.variantId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.variantId.message}
              </p>
            )}
          </div>

          {/* Product Review */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <label className="text-sm font-medium mb-3 block">
                {t("productReview")}
              </label>
              <FaInfoCircle className="w-4 h-4" />
            </div>
            <div className="relative">
              <textarea
                {...register("review")}
                placeholder={t("provideDetailedReview")}
                className="w-full px-4 py-3 bg-lightGray/20 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400 flex items-center gap-1">
                <span>{review.length}</span>
                <FaPen className="w-3 h-3" />
              </div>
            </div>
            {errors.review && (
              <p className="text-red-500 text-sm mt-1">
                {errors.review.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/80 transition-colors font-medium"
            >
              {t("submit")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
