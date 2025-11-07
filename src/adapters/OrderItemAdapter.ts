// File: adapters/OrderItemAdapter.ts
import { typOrderItem } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { StrapiOrderItem } from "./interfaces/types";
import { ProductAdapter } from "./ProductAdapter";
import { ColorAdapter } from "./ColorAdapter";

export class OrderItemAdapter extends BaseAdapter<
  StrapiOrderItem,
  typOrderItem
> {
  private static instance: OrderItemAdapter;
  private productAdapter: ProductAdapter;
  private colorAdapter: ColorAdapter;

  private constructor(strapiUrl: string) {
    super(strapiUrl);
    this.productAdapter = ProductAdapter.getInstance(strapiUrl);
    this.colorAdapter = ColorAdapter.getInstance(strapiUrl);
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
      discountValue: source.discount_value,
      product: this.productAdapter.adapt(source.product),
      selectedColor: this.colorAdapter.adapt(source.selected_color),
      total: source.total,
      subtotal: source.subtotal,
    };
  }
}
