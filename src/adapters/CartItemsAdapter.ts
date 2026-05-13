// File: adapters/BrandAdapter.ts
import { typCartItem } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { CartItemDB } from "./interfaces/types";
import { ProductAdapter } from "./ProductAdapter";
import { VariantAdapter } from "./VariantAdapter";

export class CartItemsAdapter extends BaseAdapter<CartItemDB, typCartItem> {
  private static instance: CartItemsAdapter;
  private variantAdapter: VariantAdapter;
  private productAdapter: ProductAdapter;

  private constructor() {
    super();
    this.variantAdapter = VariantAdapter.getInstance();
    this.productAdapter = ProductAdapter.getInstance();
  }

  public static getInstance(): CartItemsAdapter {
    if (!CartItemsAdapter.instance) {
      CartItemsAdapter.instance = new CartItemsAdapter();
    }
    return CartItemsAdapter.instance;
  }

  adapt(source: CartItemDB): typCartItem {
    return {
      id: source.id,
      quantity: source.quantity,
      total: source.total_price,
      unitPrice: source.unit_price,
      product: this.productAdapter.adapt(source.product),
      variant: this.variantAdapter.adapt(source.variant),
    };
  }
}
