// File: adapters/OrderItemAdapter.ts
import { typOrderItem } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { orderItemDB } from "./interfaces/types";
import { VariantAdapter } from "./VariantAdapter";
import { ProductAdapter } from "./ProductAdapter";

export class OrderItemAdapter extends BaseAdapter<orderItemDB, typOrderItem> {
  private static instance: OrderItemAdapter;
  private variantAdapter: VariantAdapter;
  private productAdapter: ProductAdapter;

  private constructor() {
    super();
    this.variantAdapter = VariantAdapter.getInstance();
    this.productAdapter = ProductAdapter.getInstance();
  }

  public static getInstance(): OrderItemAdapter {
    if (!OrderItemAdapter.instance) {
      OrderItemAdapter.instance = new OrderItemAdapter();
    }
    return OrderItemAdapter.instance;
  }

  adapt(source: orderItemDB): typOrderItem {
    return {
      id: source.id,
      quantity: source.quantity,
      unitPrice: source.unit_price,
      discountAmount: source.discount_amount,
      variant: this.variantAdapter.adapt(source.variant),
      product: this.productAdapter.adapt(source.product),
      total: source.total_price,
      subtotal: source.subtotal_price,
      status: source.status,
    };
  }
}
