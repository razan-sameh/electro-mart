// File: adapters/BrandAdapter.ts
import { typCart, typWishlist } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { CartDB, StrapiWishlist } from "./interfaces/types";
import { CartItemsAdapter } from "./CartItemsAdapter";
import { WishlistItemsAdapter } from "./WishlistItemsAdapter";

export class WishlistAdapter extends BaseAdapter<StrapiWishlist, typWishlist> {
  private static instance: WishlistAdapter;
  private wishlistItemsAdapter: WishlistItemsAdapter;

  private constructor() {
    super();
    this.wishlistItemsAdapter = WishlistItemsAdapter.getInstance();
  }

  public static getInstance(): WishlistAdapter {
    if (!WishlistAdapter.instance) {
      WishlistAdapter.instance = new WishlistAdapter();
    }
    return WishlistAdapter.instance;
  }

  adapt(source: StrapiWishlist): typWishlist {
    return {
      id: source.documentId,
      items: this.wishlistItemsAdapter.adaptMany(source.wishlist_items || []),
    };
  }
}
