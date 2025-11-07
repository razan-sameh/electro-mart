// File: adapters/OrderItemAdapter.ts
import { typPayment } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { StrapiPayment } from "./interfaces/types";
import { PaymentMethodAdapter } from "./PaymentMethodAdapter";

export class PaymentAdapter extends BaseAdapter<StrapiPayment, typPayment> {
  private static instance: PaymentAdapter;
  private paymentMethodAdapter: PaymentMethodAdapter;

  private constructor(strapiUrl: string) {
    super(strapiUrl);
        this.paymentMethodAdapter = PaymentMethodAdapter.getInstance(strapiUrl);
    
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
      paymentMethod: this.paymentMethodAdapter.adapt(source.payment_method),
      totalPayment: source.Amount,
      paymentStatus: source.payment_status,
    };
  }
}
