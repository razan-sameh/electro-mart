// File: adapters/OrderItemAdapter.ts
import { typShippingAddress } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { AddressDB } from "./interfaces/types";

export class AddressAdapter extends BaseAdapter<AddressDB, typShippingAddress> {
  private static instance: AddressAdapter;

  private constructor() {
    super();
  }

  public static getInstance(): AddressAdapter {
    if (!AddressAdapter.instance) {
      AddressAdapter.instance = new AddressAdapter();
    }
    return AddressAdapter.instance;
  }

  adapt(source: AddressDB): typShippingAddress {
    return {
      city: source.city,
      country: source.country,
      postalCode: source.postalCode,
      streetAddress: source.streetAddress,
    };
  }
}
