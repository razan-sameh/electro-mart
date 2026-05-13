// File: adapters/SpecialOfferAdapter.ts
import { typProductOffer } from "@/content/types";
import { BaseAdapter } from './base/BaseAdapter';
import { ProductOfferDB } from "./interfaces/types";

export class SpecialOfferAdapter extends BaseAdapter<ProductOfferDB, typProductOffer> {
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

  adapt(source: ProductOfferDB): typProductOffer {
    return {
      title: this.handleNullUndefined(source.title, ""),
      discountPercent: source.discount_percent,
      discountAmount: this.handleNullUndefined(source.discount_amount, 0),
      startDate: this.handleNullUndefined(source.start_date, ""),
      endDate: this.handleNullUndefined(source.end_date, ""),
    };
  }
}
