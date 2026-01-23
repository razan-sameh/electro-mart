// File: adapters/BrandAdapter.ts
import { typBrand, typCartItem, typWishlistItem } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { CartItemDB, StrapiWishlistItem } from "./interfaces/types";
import { ColorAdapter } from "./ColorAdapter";
import { ProductAdapter } from "./ProductAdapter";

export class WishlistItemsAdapter extends BaseAdapter<StrapiWishlistItem, typWishlistItem> {
  private static instance: WishlistItemsAdapter;
  private colorAdapter: ColorAdapter;
  private productAdapter: ProductAdapter;

  private constructor() {
    super();
    this.colorAdapter = ColorAdapter.getInstance();
    this.productAdapter = ProductAdapter.getInstance();
  }

  public static getInstance(): WishlistItemsAdapter {
    if (!WishlistItemsAdapter.instance) {
      WishlistItemsAdapter.instance = new WishlistItemsAdapter();
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
