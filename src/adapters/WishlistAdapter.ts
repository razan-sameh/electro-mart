// File: adapters/BrandAdapter.ts
import { typWishlist } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { WishlistDB } from "./interfaces/types";
import { WishlistItemsAdapter } from "./WishlistItemsAdapter";

export class WishlistAdapter extends BaseAdapter<WishlistDB, typWishlist> {
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

  adapt(source: WishlistDB): typWishlist {
    return {
      id: source.id,
      items: this.wishlistItemsAdapter.adaptMany(source.items || []),
    };
  }
}
