// File: adapters/BrandAdapter.ts
import { typWishlistItem } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { WishlistItemDB } from "./interfaces/types";
import { ProductAdapter } from "./ProductAdapter";
import { VariantAdapter } from "./VariantAdapter";
import { SpecialOfferAdapter } from "./SpecialOfferAdapter";

export class WishlistItemsAdapter extends BaseAdapter<
  WishlistItemDB,
  typWishlistItem
> {
  private static instance: WishlistItemsAdapter;
  private productAdapter: ProductAdapter;
  private variantAdapter: VariantAdapter;
  private specialOfferAdapter: SpecialOfferAdapter;

  private constructor() {
    super();
    this.variantAdapter = VariantAdapter.getInstance();
    this.productAdapter = ProductAdapter.getInstance();
    this.specialOfferAdapter = SpecialOfferAdapter.getInstance();
  }

  public static getInstance(): WishlistItemsAdapter {
    if (!WishlistItemsAdapter.instance) {
      WishlistItemsAdapter.instance = new WishlistItemsAdapter();
    }
    return WishlistItemsAdapter.instance;
  }

  adapt(source: WishlistItemDB): typWishlistItem {
    return {
      id: source.id,
      product: this.productAdapter.adapt(source.product),
      variant: this.variantAdapter.adapt(source.variant),
      originalPrice: source.original_price,
      displayPrice: source.display_price,
      appliedOffer: this.specialOfferAdapter.adapt(source.applied_offer || {}),
    };
  }
}
