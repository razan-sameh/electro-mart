// File: adapters/BrandAdapter.ts
import { typPhone } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { PhoneDB } from "./interfaces/types";

export class PhoneAdapter extends BaseAdapter<PhoneDB, typPhone> {
  private static instance: PhoneAdapter;

  private constructor() {
    super();
  }

  public static getInstance(): PhoneAdapter {
    if (!PhoneAdapter.instance) {
      PhoneAdapter.instance = new PhoneAdapter();
    }
    return PhoneAdapter.instance;
  }

  adapt(source: PhoneDB): typPhone {
    return {
      countryCode: this.handleNullUndefined(source.countryCode, ""),
      dialCode: this.handleNullUndefined(source.dialCode, ""),
      number: this.handleNullUndefined(source.number, ""),
    };
  }
}
