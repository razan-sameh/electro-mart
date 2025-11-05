// File: adapters/OrderItemAdapter.ts
import { typOrderItem } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { StrapiOrderItem } from "./interfaces/types";
import { ProductAdapter } from "./ProductAdapter";

export class OrderItemAdapter extends BaseAdapter<
  StrapiOrderItem,
  typOrderItem
> {
  private static instance: OrderItemAdapter;
  private productAdapter: ProductAdapter;

  private constructor(strapiUrl: string) {
    super(strapiUrl);
    this.productAdapter = ProductAdapter.getInstance(strapiUrl);
  }

  public static getInstance(strapiUrl: string): OrderItemAdapter {
    if (!OrderItemAdapter.instance) {
      OrderItemAdapter.instance = new OrderItemAdapter(strapiUrl);
    }
    return OrderItemAdapter.instance;
  }

  adapt(source: StrapiOrderItem): typOrderItem {
    return {
      id: source.id,
      documentId: source.documentId,
      quantity: source.Quantity,
      UnitPrice: source.UnitPrice,
      product: this.productAdapter.adapt(source.product),
    };
  }
}
