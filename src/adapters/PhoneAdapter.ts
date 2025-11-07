// File: adapters/BrandAdapter.ts
import { typColor, typPhone } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { StrapiColor, StrapiPhone } from "./interfaces/types";

export class PhoneAdapter extends BaseAdapter<StrapiPhone, typPhone> {
  private static instance: PhoneAdapter;

  private constructor(strapiUrl: string) {
    super(strapiUrl);
  }

  public static getInstance(strapiUrl: string): PhoneAdapter {
    if (!PhoneAdapter.instance) {
      PhoneAdapter.instance = new PhoneAdapter(strapiUrl);
    }
    return PhoneAdapter.instance;
  }

  adapt(source: StrapiPhone): typPhone {
    return {
      id: source.id,
      documentId: source.documentId,
      countryCode: this.handleNullUndefined(source.countryCode, ""),
      dialCode: this.handleNullUndefined(source.dailcode, ""),
      number: this.handleNullUndefined(source.number, ""),
    };
  }
}
