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
    <div className="p-4 border border-lightGray rounded-lg">
      {/* User Info */}
      <div className="flex items-center gap-2 mb-1">
        <FaUser size={20} className="text-gray-600" />
        <p className="font-medium">{review.user.username || "Anonymous"}</p>
      </div>

      {/* Date */}
      <p className="text-sm text-gray-500 mb-2 text-start">
        {formatDateTime(review.createdAt, local)}
      </p>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-2">
        <StarRating rating={review.rating} size={18} />
        <span className="font-medium">{review.rating}</span>
      </div>

      {/* Comment */}
      <p className="text-start">{review.comment}</p>
    </div>
  );
}
