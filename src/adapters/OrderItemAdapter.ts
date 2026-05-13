import { typOrderItem } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { orderItemDB } from "./interfaces/types";

export class OrderItemAdapter extends BaseAdapter<orderItemDB, typOrderItem> {
  private static instance: OrderItemAdapter;

  private constructor() {
    super();
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
      productTitle: source.product_title,
      productImage: source.product_image,
      sku: source.sku,
      quantity: source.quantity,
      unitPrice: source.unit_price,
      total: source.total_price,
      status: source.status,
      productVariantId: source.product_variant_id,
    };
  }
}