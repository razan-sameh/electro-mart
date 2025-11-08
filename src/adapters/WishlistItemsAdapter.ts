// File: adapters/BrandAdapter.ts
import { typBrand, typCartItem, typWishlistItem } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { StrapiCartItem, StrapiWishlistItem } from "./interfaces/types";
import { ColorAdapter } from "./ColorAdapter";
import { ProductAdapter } from "./ProductAdapter";

export class WishlistItemsAdapter extends BaseAdapter<StrapiWishlistItem, typWishlistItem> {
  private static instance: WishlistItemsAdapter;
  private colorAdapter: ColorAdapter;
  private productAdapter: ProductAdapter;

  private constructor(strapiUrl: string) {
    super(strapiUrl);
    this.colorAdapter = ColorAdapter.getInstance(strapiUrl);
    this.productAdapter = ProductAdapter.getInstance(strapiUrl);
  }

  public static getInstance(strapiUrl: string): WishlistItemsAdapter {
    if (!WishlistItemsAdapter.instance) {
      WishlistItemsAdapter.instance = new WishlistItemsAdapter(strapiUrl);
    }
    return WishlistItemsAdapter.instance;
  }

  adapt(source: StrapiWishlistItem): typWishlistItem {
    return {
      id: source.id,
      documentId: source.documentId,
      product: this.productAdapter.adapt(source.product),
      selectedColor: this.colorAdapter.adapt(source.product_color),
    };
  }
}
