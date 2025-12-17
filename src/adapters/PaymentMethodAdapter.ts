// File: adapters/OrderItemAdapter.ts
import { typPayment, typPaymentMethod } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { StrapiPayment, StrapiPaymentMethod } from "./interfaces/types";

export class PaymentMethodAdapter extends BaseAdapter<
  StrapiPaymentMethod,
  typPaymentMethod
> {
  private static instance: PaymentMethodAdapter;

  private constructor() {
    super();
  }

  public static getInstance(): PaymentMethodAdapter {
    if (!PaymentMethodAdapter.instance) {
      PaymentMethodAdapter.instance = new PaymentMethodAdapter();
    }
    return PaymentMethodAdapter.instance;
  }

  adapt(source: StrapiPaymentMethod): typPaymentMethod {
    return {
      id: source.id,
      documentId: source.documentId,
      brand: source.brand,
      expMonth: source.exp_month,
      expYear: source.exp_year,
      last4: source.last4,
      token: source.token,
    };
  }
}
