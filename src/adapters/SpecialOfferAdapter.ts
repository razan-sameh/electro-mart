// File: adapters/SpecialOfferAdapter.ts
import { typSpecialOffer } from "@/content/types";
import { BaseAdapter } from './base/BaseAdapter';
import { enmDiscountType } from "@/content/enums";
import { StrapiSpecialOffer } from "./interfaces/types";

export class SpecialOfferAdapter extends BaseAdapter<StrapiSpecialOffer, typSpecialOffer> {
  private static instance: SpecialOfferAdapter;

  private constructor() {
    super();
  }

  public static getInstance(): SpecialOfferAdapter {
    if (!SpecialOfferAdapter.instance) {
      SpecialOfferAdapter.instance = new SpecialOfferAdapter();
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
}
