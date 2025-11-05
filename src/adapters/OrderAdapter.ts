// File: adapters/OrderAdapter.ts
import { typAddress, typOrder } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { StrapiOrder } from "./interfaces/types";
import { OrderItemAdapter } from "./OrderItemAdapter";
import { PaymentAdapter } from "./PaymentAdapter";
import { enmOrderStatus } from "@/content/enums";

export class OrderAdapter extends BaseAdapter<StrapiOrder, typOrder> {
  private static instance: OrderAdapter;
  private orderItemAdapter: OrderItemAdapter;
  private paymentAdapter: PaymentAdapter;

  private constructor(strapiUrl: string) {
    super(strapiUrl);
    this.orderItemAdapter = OrderItemAdapter.getInstance(strapiUrl);
    this.paymentAdapter = PaymentAdapter.getInstance(strapiUrl);
  }

  public static getInstance(strapiUrl: string): OrderAdapter {
    if (!OrderAdapter.instance) {
      OrderAdapter.instance = new OrderAdapter(strapiUrl);
    }
    return OrderAdapter.instance;
  }
  private mapOrderStatus(
    status: StrapiOrder["order_status"]
  ): typOrder["orderStatus"] {
    switch (status) {
      case "Pending":
        return enmOrderStatus.PROCESSING;
      case "Shipped":
        return enmOrderStatus.DELIVERED; // or whatever mapping fits your logic
      case "Delivered":
        return enmOrderStatus.DELIVERED;
      case "Cancelled":
        return enmOrderStatus.CANCELLED;
      default:
        return enmOrderStatus.PROCESSING; // fallback
    }
  }
  private mapAddress(source: any): typAddress {
    return {
      id: source?.id || "",
      streetAddress: source?.streetAddress || "",
      postalCode: source?.postalCode || 0,
      city: source?.city || "",
      country: source?.country || "",
    };
  }

  adapt(source: StrapiOrder): typOrder {
    return {
      id: source.id,
      documentId: source.documentId,
      totalPayment: source.TotalAmount,
      orderStatus: this.mapOrderStatus(source.order_status), // <-- mapped
      ShippingAddress: this.mapAddress(source.ShippingAddress), // <-- we'll handle this next
      orderItems: this.orderItemAdapter.adaptMany(source.order_items),
      payment: this.paymentAdapter.adapt(source.payment),
      date: source.createdAt, // if you want to set date
    };
  }
}
