// File: adapters/BrandAdapter.ts
import { typBrand, typCartItem } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { StrapiCartItem } from "./interfaces/types";
import { ColorAdapter } from "./ColorAdapter";
import { ProductAdapter } from "./ProductAdapter";

export class CartItemsAdapter extends BaseAdapter<StrapiCartItem, typCartItem> {
  private static instance: CartItemsAdapter;
  private colorAdapter: ColorAdapter;
  private productAdapter: ProductAdapter;

  private constructor() {
    super();
    this.colorAdapter = ColorAdapter.getInstance();
    this.productAdapter = ProductAdapter.getInstance();
  }

  public static getInstance(): CartItemsAdapter {
    if (!CartItemsAdapter.instance) {
      CartItemsAdapter.instance = new CartItemsAdapter();
    }
    return CartItemsAdapter.instance;
  }

  adapt(source: StrapiCartItem): typCartItem {
    return {
      id: source.id,
      documentId: source.documentId,
      quantity: source.Quantity,
      product: this.productAdapter.adapt(source.product),
      selectedColor: this.colorAdapter.adapt(source.product_color),
    };
  }
}
