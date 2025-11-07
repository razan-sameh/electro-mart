// File: adapters/OrderItemAdapter.ts
import { typShippingAddress } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { StrapiAddress } from "./interfaces/types";
import { PhoneAdapter } from "./PhoneAdapter";

export class AddressAdapter extends BaseAdapter<
  StrapiAddress,
  typShippingAddress
> {
  private static instance: AddressAdapter;
  private phoneAdapter: PhoneAdapter;

  private constructor(strapiUrl: string) {
    super(strapiUrl);
    this.phoneAdapter = PhoneAdapter.getInstance(strapiUrl);
  }

  public static getInstance(strapiUrl: string): AddressAdapter {
    if (!AddressAdapter.instance) {
      AddressAdapter.instance = new AddressAdapter(strapiUrl);
    }
    return AddressAdapter.instance;
  }

  adapt(source: StrapiAddress): typShippingAddress {
    return {
      id: source.id,
      documentId: source.documentId,
      phone: this.phoneAdapter.adapt(source.phone),
      city: source.city,
      country: source.country,
      postalCode: source.postalCode,
      streetAddress: source.streetAddress,
    };
  }
}
