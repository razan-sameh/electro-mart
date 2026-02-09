// File: adapters/OrderAdapter.ts
import { typOrder } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { orderDB } from "./interfaces/types";
import { OrderItemAdapter } from "./OrderItemAdapter";
import { PaymentAdapter } from "./PaymentAdapter";
import { AddressAdapter } from "./AddressAdapter";
import { PhoneAdapter } from "./PhoneAdapter";

export class OrderAdapter extends BaseAdapter<orderDB, typOrder> {
  private static instance: OrderAdapter;
  private orderItemAdapter: OrderItemAdapter;
  private paymentAdapter: PaymentAdapter;
  private addressAdapter: AddressAdapter;
  private phoneAdapter: PhoneAdapter;

  private constructor() {
    super();
    this.orderItemAdapter = OrderItemAdapter.getInstance();
    this.paymentAdapter = PaymentAdapter.getInstance();
    this.addressAdapter = AddressAdapter.getInstance();
    this.phoneAdapter = PhoneAdapter.getInstance();
  }

  public static getInstance(): OrderAdapter {
    if (!OrderAdapter.instance) {
      OrderAdapter.instance = new OrderAdapter();
    }
    return OrderAdapter.instance;
  }

  adapt(source: orderDB): typOrder {
    return {
      id: source.id,
      total: source.total_amount,
      subtotal: source.subtotal_amount,
      discountAmount: source.discount_amount || null,
      orderStatus: source.status,
      date: source.created_at,
      orderNumber: source.order_number,
      phone: source.phone
        ? this.phoneAdapter.adapt(source.phone)
        : null,
      ShippingAddress: source.shipping_address
        ? this.addressAdapter.adapt(source.shipping_address)
        : null, // ✅ allow null
      payment: source.payment
        ? this.paymentAdapter.adapt(source.payment)
        : null, // ✅ allow null
      items: this.orderItemAdapter.adaptMany(source.items),
    };
  }
}
