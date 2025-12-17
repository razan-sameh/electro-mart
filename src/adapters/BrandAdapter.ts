// File: adapters/BrandAdapter.ts
import { typBrand } from "@/content/types";
import { BaseAdapter } from './base/BaseAdapter';
import { StrapiBrand } from "./interfaces/types";

export class BrandAdapter extends BaseAdapter<StrapiBrand, typBrand> {
  private static instance: BrandAdapter;

  private constructor() {
    super();
  }

  public static getInstance(): BrandAdapter {
    if (!BrandAdapter.instance) {
      BrandAdapter.instance = new BrandAdapter();
    }
    return BrandAdapter.instance;
  }

  adapt(source: StrapiBrand): typBrand {
    return {
      id: source.documentId,
      name: this.handleNullUndefined(source.Name, ''),
      imageUrl: this.adaptImageUrlSingle(source.LogoURL),
      // Don't adapt products here to avoid circular dependencies
    };
  }
}