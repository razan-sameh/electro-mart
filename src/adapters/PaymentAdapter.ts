// File: adapters/OrderItemAdapter.ts
import { typPayment } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { paymentDB } from "./interfaces/types";

export class PaymentAdapter extends BaseAdapter<paymentDB, typPayment> {
  private static instance: PaymentAdapter;

  private constructor() {
    super();
  }

  public static getInstance(): PaymentAdapter {
    if (!PaymentAdapter.instance) {
      PaymentAdapter.instance = new PaymentAdapter();
    }
    return PaymentAdapter.instance;
  }

  adapt(source: paymentDB): typPayment {
    return {
      id: source.id,
      paymentMethod: source.payment_method,
      totalPayment: source.amount,
      paymentStatus: source.status,
      amount: source.amount,
      cardBrand: source.card_brand,
      cardExpMonth: source.card_exp_month,
      cardExpYear: source.card_exp_year,
      cardLast4: source.card_last4,
      createdAt: source.created_at,
      currency: source.currency,
      paymentIntentId: source.payment_intent_id,
      status: source.status,
      transactionId: source.transaction_id || null,
    };
  }
}
