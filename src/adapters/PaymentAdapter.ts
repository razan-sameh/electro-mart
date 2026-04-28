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
      paymentMethod: source.payment_method,
      paymentStatus: source.status,
      amount: source.amount,
      currency: source.currency,
      cardBrand: source.card_brand,
      cardLast4: source.card_last4,
    };
  }
}