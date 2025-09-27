"use client";

import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { RatingBreakdown, typReview } from "@/content/types";
import { formatDateTime, getRatingTable } from "@/content/utils";
import { FaUser } from "react-icons/fa";
import { useLocale } from "next-intl";
import { StarRating } from "@/components/reusable/StarRating";

interface Props {
  reviews?: typReview[];
  averageRating: number;
}

export default function ProductReviews({ reviews, averageRating }: Props) {
  const breakdown: RatingBreakdown[] = getRatingTable(reviews!);
  const local = useLocale();
  return (
    <div className="mt-12 flex flex-col lg:flex-row gap-12">
      {/* Left: Customer Review Summary */}
      <div className="lg:w-1/4 p-4 border border-lightGray rounded-lg">
        <h2 className="text-lg font-semibold mb-2 text-center">
          Customer reviews
        </h2>
        <div className="flex items-center justify-center mb-4">
          <StarRating rating={averageRating} size={18} />
        </div>

        {/* Breakdown bars */}
        <div className="space-y-2">
          {breakdown.map((row) => (
            <div key={row.star} className="flex items-center gap-2">
              <span className="w-10 text-sm">{row.star} star</span>
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

        <p className="py-8 text-start">
          Share your feedback and create a better shopping experience for
          everyone. Thank you for taking the time to share your opinion.
        </p>
        <button className="w-full px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition">
          Write a review
        </button>
      </div>

      {/* Right: Reviews List */}
      <div className="flex-1 space-y-4">
        {reviews?.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          reviews?.map((review) => (
            <div
              key={review.id}
              className="p-4 border border-lightGray rounded-lg"
            >
              {/* User info */}
              <div className="flex items-center gap-2 mb-1">
                <FaUser size={20} className="text-gray-600" />
                <p className="font-medium">
                  {review.user.username || "Razan Sameh"}
                </p>
              </div>

              {/* Date */}
              <p className="text-sm text-gray-500 mb-2 text-start">
                {formatDateTime(review.createdAt, local)}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                {/* {Array.from({ length: review.rating }).map((_, i) => (
                  <FaStar key={i} size={16} className="fill-secondary" />
                ))} */}
                          <StarRating rating={averageRating} size={18} />

                <span className="font-medium">{review.rating}</span>
              </div>

              {/* Comment */}
              <p className="text-start">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
