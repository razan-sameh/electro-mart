import { useState } from "react";
import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  size?: number;
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const StarRating = ({
  rating,
  size = 16,
  readonly = true,
  onRatingChange,
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  const handleClick = (clickedRating: number) => {
    if (readonly) return;
    setCurrentRating(clickedRating);
    onRatingChange?.(clickedRating);
  };

  const handleMouseEnter = (hoveredRating: number) => {
    if (readonly) return;
    setHoverRating(hoveredRating);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  // Use hover rating if hovering, otherwise use current rating
  const displayRating = readonly ? rating : hoverRating || currentRating;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = displayRating >= starValue;
        const isHalfFilled =
          displayRating >= starValue - 0.5 && displayRating < starValue;

        return (
          <div
            key={index}
            className={`relative ${
              !readonly
                ? "cursor-pointer hover:scale-110 transition-transform"
                : "cursor-default"
            }`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Background star */}
            <FaStar size={size} className="fill-lightGray/90" />

            {/* Filled star overlay */}
            {(isFilled || isHalfFilled) && (
              <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{
                  width: isHalfFilled ? "50%" : "100%",
                }}
              >
                <FaStar size={size} className="fill-secondary" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
