// File: adapters/OrderAdapter.ts
import { typShippingAddress, typOrder } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { StrapiOrder } from "./interfaces/types";
import { OrderItemAdapter } from "./OrderItemAdapter";
import { PaymentAdapter } from "./PaymentAdapter";
import { enmOrderStatus } from "@/content/enums";
import { UserAdapter } from "./UserAdapter";
import { AddressAdapter } from "./AddressAdapter";

export class OrderAdapter extends BaseAdapter<StrapiOrder, typOrder> {
  private static instance: OrderAdapter;
  private orderItemAdapter: OrderItemAdapter;
  private paymentAdapter: PaymentAdapter;
  private userAdapter: UserAdapter;
  private addressAdapter: AddressAdapter;

  private constructor() {
    super();
    this.orderItemAdapter = OrderItemAdapter.getInstance();
    this.paymentAdapter = PaymentAdapter.getInstance();
    this.userAdapter = UserAdapter.getInstance();
    this.addressAdapter = AddressAdapter.getInstance();
  }

  public static getInstance(): OrderAdapter {
    if (!OrderAdapter.instance) {
      OrderAdapter.instance = new OrderAdapter();
    }
    return OrderAdapter.instance;
  }
  private mapOrderStatus(
    status: StrapiOrder["order_status"]
  ): typOrder["orderStatus"] {
    switch (status) {
      case "Pending":
        return enmOrderStatus.PENDING;
      case "Shipped":
        return enmOrderStatus.SHIPPED; // or whatever mapping fits your logic
      case "Delivered":
        return enmOrderStatus.DELIVERED;
      case "Cancelled":
        return enmOrderStatus.CANCELLED;
      default:
        return enmOrderStatus.PENDING; // fallback
    }
  }

  adapt(source: StrapiOrder): typOrder {
    return {
      id: source.id,
      documentId: source.documentId,
      total: source.Total,
      subtotal: source.subtotal,
      discountTotal: source.discount_total,
      orderStatus: this.mapOrderStatus(source.order_status),
      payment: this.paymentAdapter.adapt(source.payment),
      date: source.createdAt,
      ShippingAddress: this.addressAdapter.adapt(source.address), // <-- we'll handle this next
      orderItems: this.orderItemAdapter.adaptMany(source.order_items),
      user: this.userAdapter.adapt(source.user),
    };
  }
}
