// File: adapters/OrderItemAdapter.ts
import { typPayment } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { StrapiPayment } from "./interfaces/types";

export class PaymentAdapter extends BaseAdapter<StrapiPayment, typPayment> {
  private static instance: PaymentAdapter;

  private constructor(strapiUrl: string) {
    super(strapiUrl);
  }

  public static getInstance(strapiUrl: string): PaymentAdapter {
    if (!PaymentAdapter.instance) {
      PaymentAdapter.instance = new PaymentAdapter(strapiUrl);
    }
    return PaymentAdapter.instance;
  }

  adapt(source: StrapiPayment): typPayment {
    return {
      id: source.id,
      documentId: source.documentId,
      paymentMethod: source.PaymentMethod,
      totalPayment: source.Amount,
      paymentStatus: source.payment_status,
    };
  }
}
