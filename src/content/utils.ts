import { RatingBreakdown, typProduct, typReview } from "./types";
import moment from "moment";
import "moment/locale/ar"; // import Arabic locale explicitly
import { enmDiscountType } from "./enums";

export function formatDateTime(date: string | Date, locale: string): string {
  return moment(date).locale(locale).format("D MMMM YYYY");
}

export function getRatingTable(reviews: typReview[]): RatingBreakdown[] {
  const totalReviews = reviews.length;

  // Count reviews per star
  const counts: Record<number, number> = [1, 2, 3, 4, 5].reduce((acc, star) => {
    acc[star] = reviews.filter((r) => r.rating === star).length;
    return acc;
  }, {} as Record<number, number>);

  // Create table
  const table: RatingBreakdown[] = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: counts[star],
    percentage: totalReviews > 0 ? (counts[star] / totalReviews) * 100 : 0,
  }));

  return table;
}

export function calculateDiscountedPrice(product: typProduct): number {
  let discountedPrice = product.price;

  if (product.specialOffers?.length) {
    const offer = product.specialOffers[0];

    if (offer?.discountType === enmDiscountType.percentage) {
      discountedPrice = product.price - product.price * (offer.discountValue / 100);
    } else if (offer?.discountType === enmDiscountType.fixed) {
      discountedPrice = product.price - offer.discountValue;
    }
  }

  // Prevent negative prices
  return Math.max(0, discountedPrice);
}