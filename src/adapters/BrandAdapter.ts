// File: adapters/BrandAdapter.ts
import { typBrand } from "@/content/types";
import { BaseAdapter } from './base/BaseAdapter';
import { StrapiBrand } from "./interfaces/types";

export class BrandAdapter extends BaseAdapter<StrapiBrand, typBrand> {
  private static instance: BrandAdapter;

  private constructor(strapiUrl: string) {
    super(strapiUrl);
  }

  public static getInstance(strapiUrl: string): BrandAdapter {
    if (!BrandAdapter.instance) {
      BrandAdapter.instance = new BrandAdapter(strapiUrl);
    }
    return BrandAdapter.instance;
  }

  adapt(source: StrapiBrand): typBrand {
    return {
      id: source.documentId,
      name: this.handleNullUndefined(source.Name, ''),
      imageUrl: this.adaptImageUrl(source.LogoURL),
      // Don't adapt products here to avoid circular dependencies
    };
  }
}