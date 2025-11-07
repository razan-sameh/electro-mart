import { enmDiscountType } from "@/content/enums";
import { enmStrapiDiscountType } from "./enms";

export function mapDiscountType(type: enmStrapiDiscountType): enmDiscountType {
  const map: Record<enmStrapiDiscountType, enmDiscountType> = {
    [enmStrapiDiscountType.percentage]: enmDiscountType.percentage,
    [enmStrapiDiscountType.fixed]: enmDiscountType.fixed,
  };
  return map[type];
}