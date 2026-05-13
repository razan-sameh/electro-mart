// File: adapters/BrandAdapter.ts
import { typProductSpec } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { ProductSpecDB } from "./interfaces/types";

export class SpecificationAdapter extends BaseAdapter<
  ProductSpecDB,
  typProductSpec
> {
  private static instance: SpecificationAdapter;

  private constructor() {
    super();
  }

  public static getInstance(): SpecificationAdapter {
    if (!SpecificationAdapter.instance) {
      SpecificationAdapter.instance = new SpecificationAdapter();
    }
    return SpecificationAdapter.instance;
  }

  adapt(source: ProductSpecDB): typProductSpec {
    return {
      id:source.id,
      key: this.handleNullUndefined(source.key, ""),
      value: this.handleNullUndefined(source.value, ""),
      is_filterable: source.is_filterable
    };
  }
}
