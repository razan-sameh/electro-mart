// File: adapters/BrandAdapter.ts
import { typProductSpec } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { ProductSpecDB } from "./interfaces/types";

export class SpecificationValueAdapter extends BaseAdapter<
  ProductSpecDB,
  typProductSpec
> {
  private static instance: SpecificationValueAdapter;

  private constructor() {
    super();
  }

  public static getInstance(): SpecificationValueAdapter {
    if (!SpecificationValueAdapter.instance) {
      SpecificationValueAdapter.instance = new SpecificationValueAdapter();
    }
    return SpecificationValueAdapter.instance;
  }

  adapt(source: ProductSpecDB): typProductSpec {
    return {
      key: this.handleNullUndefined(source.key, ""),
      value: this.handleNullUndefined(source.value, ""),
      is_filterable: source.is_filterable
    };
  }
}
