// File: adapters/SpecialOfferAdapter.ts
import { typSpecialOffer } from "@/content/types";
import { BaseAdapter } from './base/BaseAdapter';
import { enmDiscountType } from "@/content/enums";
import { StrapiSpecialOffer } from "./interfaces/types";

export class SpecialOfferAdapter extends BaseAdapter<StrapiSpecialOffer, typSpecialOffer> {
  private static instance: SpecialOfferAdapter;

  private constructor(strapiUrl: string) {
    super(strapiUrl);
  }

  public static getInstance(strapiUrl: string): SpecialOfferAdapter {
    if (!SpecialOfferAdapter.instance) {
      SpecialOfferAdapter.instance = new SpecialOfferAdapter(strapiUrl);
    }
    return SpecialOfferAdapter.instance;
  }

  adapt(source: StrapiSpecialOffer): typSpecialOffer {
    return {
      id: source.documentId,
      title: this.handleNullUndefined(source.title, ''),
      discountType: source.discount_type as enmDiscountType,
      discountValue: this.handleNullUndefined(source.discount_value, 0),
      startDate: this.handleNullUndefined(source.start_date, ''),
      endDate: this.handleNullUndefined(source.end_date, ''),
      // Don't adapt products here to avoid circular dependencies
    };
  }

  isActive(offer: typSpecialOffer): boolean {
    const now = new Date();
    const startDate = offer.startDate ? new Date(offer.startDate) : null;
    const endDate = offer.endDate ? new Date(offer.endDate) : null;

    if (startDate && now < startDate) return false;
    if (endDate && now > endDate) return false;
    
    return true;
  }

  calculateDiscountedPrice(originalPrice: number, offer: typSpecialOffer): number {
    if (!this.isActive(offer)) return originalPrice;

    switch (offer.discountType) {
      case enmDiscountType.percentage:
        return originalPrice * (1 - offer.discountValue / 100);
      case enmDiscountType.fixed:
        return Math.max(0, originalPrice - offer.discountValue);
      default:
        return originalPrice;
    }
  }
}
