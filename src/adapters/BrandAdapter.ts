// File: adapters/BrandAdapter.ts
import { typBrand } from "@/content/types";
import { BaseAdapter } from './base/BaseAdapter';
import { BrandDB } from "./interfaces/types";

export class BrandAdapter extends BaseAdapter<BrandDB, typBrand> {
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

  adapt(source: BrandDB): typBrand {
    return {
      id: source.brand.id,
      name: this.handleNullUndefined(source.name, ""),
      imageUrl: source.brand.logo_url || "",
    };
  }
}