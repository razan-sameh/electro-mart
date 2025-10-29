// File: adapters/BrandAdapter.ts
import { typColor } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { StrapiColor } from "./interfaces/types";

export class ColorAdapter extends BaseAdapter<StrapiColor, typColor> {
  private static instance: ColorAdapter;

  private constructor(strapiUrl: string) {
    super(strapiUrl);
  }

  public static getInstance(strapiUrl: string): ColorAdapter {
    if (!ColorAdapter.instance) {
      ColorAdapter.instance = new ColorAdapter(strapiUrl);
    }
    return ColorAdapter.instance;
  }

  adapt(source: StrapiColor): typColor {
    return {
      id: source.id,
      documentId: source.documentId,
      name: this.handleNullUndefined(source.name, ""),
      hexCode: this.handleNullUndefined(source.hex_code, ""),
      // Don't adapt products here to avoid circular dependencies
    };
  }
}
