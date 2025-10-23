// File: adapters/BrandAdapter.ts
import { typCart } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { StrapiCart } from "./interfaces/types";
import { CartItemsAdapter } from "./CartItemsAdapter";

export class CartAdapter extends BaseAdapter<StrapiCart, typCart> {
  private static instance: CartAdapter;
  private cartItemsAdapter: CartItemsAdapter;

  private constructor(strapiUrl: string) {
    super(strapiUrl);
    this.cartItemsAdapter = CartItemsAdapter.getInstance(strapiUrl);
  }

  public static getInstance(strapiUrl: string): CartAdapter {
    if (!CartAdapter.instance) {
      CartAdapter.instance = new CartAdapter(strapiUrl);
    }
    return CartAdapter.instance;
  }

  adapt(source: StrapiCart): typCart {
    return {
      id: source.documentId,
      items: this.cartItemsAdapter.adaptMany(source.cart_items || []),
    };
  }
}
