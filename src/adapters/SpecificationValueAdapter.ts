// File: adapters/BrandAdapter.ts
import { typSpecificationValues } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { StrapiSpecificationValue } from "./interfaces/types";

export class SpecificationValueAdapter extends BaseAdapter<
  StrapiSpecificationValue,
  typSpecificationValues
> {
  private static instance: SpecificationValueAdapter;

  private constructor() {
    super();
  }

  public static getInstance(): SpecificationValueAdapter {
    if (!SpecificationValueAdapter.instance) {
      SpecificationValueAdapter.instance = new SpecificationValueAdapter(
        
      );
    }
    return SpecificationValueAdapter.instance;
  }

  adapt(source: StrapiSpecificationValue): typSpecificationValues {
    return {
      id: source.documentId,
      name: this.handleNullUndefined(source.value, ""),
      specificationType: source.specification_type
        ? {
            id: source.specification_type.documentId,
            name: source.specification_type.name,
          }
        : undefined,
      // Don't adapt products here to avoid circular dependencies
    };
  }
}
