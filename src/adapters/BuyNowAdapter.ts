// File: adapters/BrandAdapter.ts
import { typCartItem } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { StrapiBuyNow } from "./interfaces/types";
import { ColorAdapter } from "./ColorAdapter";
import { ProductAdapter } from "./ProductAdapter";

export class BuyNowAdapter extends BaseAdapter<StrapiBuyNow, typCartItem> {
  private static instance: BuyNowAdapter;
  private colorAdapter: ColorAdapter;
  private productAdapter: ProductAdapter;

  private constructor() {
    super();
    this.colorAdapter = ColorAdapter.getInstance();
    this.productAdapter = ProductAdapter.getInstance();
  }

  public static getInstance(): BuyNowAdapter {
    if (!BuyNowAdapter.instance) {
      BuyNowAdapter.instance = new BuyNowAdapter();
    }
    return BuyNowAdapter.instance;
  }

  adapt(source: StrapiBuyNow): typCartItem {
    return {
      id: source.id,
      documentId: source.documentId,
      quantity: source.quantity,
      product: this.productAdapter.adapt(source.product),
      selectedColor: this.colorAdapter.adapt(source.product_color),
    };
  }
}
