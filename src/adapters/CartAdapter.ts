// File: adapters/BrandAdapter.ts
import { typCart } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { StrapiCart } from "./interfaces/types";
import { CartItemsAdapter } from "./CartItemsAdapter";

export class CartAdapter extends BaseAdapter<StrapiCart, typCart> {
  private static instance: CartAdapter;
  private cartItemsAdapter: CartItemsAdapter;

  private constructor() {
    super();
    this.cartItemsAdapter = CartItemsAdapter.getInstance();
  }

  public static getInstance(): CartAdapter {
    if (!CartAdapter.instance) {
      CartAdapter.instance = new CartAdapter();
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
