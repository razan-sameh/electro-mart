"use client";

import { FaUser } from "react-icons/fa";
import { StarRating } from "@/components/reusable/StarRating";
import { formatDateTime } from "@/content/utils";
import { useLocale } from "next-intl";
import { typReview } from "@/content/types";

interface Props {
  review: typReview;
}

export default function ReviewCard({ review }: Props) {
  const local = useLocale();

  return (
    <div className="p-4 border border-lightGray rounded-lg space-y-2">
      {/* User Info */}
      <div className="flex items-center gap-2">
        <FaUser size={20} className="text-gray-600" />
        <p className="font-medium">{review.userName || "Anonymous"}</p>
      </div>

      {/* Date */}
      <p className="text-sm text-gray-500 text-start">
        {formatDateTime(review.createdAt, local)}
      </p>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <StarRating rating={review.rating} size={18} />
        <span className="font-medium">{review.rating}</span>
      </div>

      {/* Variant Info */}
      {review.variantAttributes && review.variantAttributes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {review.variantAttributes.map((attr) => (
            <div
              key={attr.id}
              className="flex items-center gap-1 px-2 py-1 bg-lightGray/20 rounded-lg text-xs"
            >
              {attr.hexCode && (
                <span
                  className="w-3 h-3 rounded-full border border-gray-300 inline-block"
                  style={{ backgroundColor: attr.hexCode }}
                />
              )}
              <span className="text-gray-500">{attr.attribute}:</span>
              <span className="font-medium">{attr.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Comment */}
      <p className="text-start">{review.comment}</p>
    </div>
  );
}
