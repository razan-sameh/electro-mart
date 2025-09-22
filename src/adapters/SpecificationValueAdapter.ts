// File: adapters/BrandAdapter.ts
import { typSpecificationValus } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { StrapiSpecificationValue } from "./interfaces/types";

export class SpecificationValueAdapter extends BaseAdapter<
  StrapiSpecificationValue,
  typSpecificationValus
> {
  private static instance: SpecificationValueAdapter;

  private constructor(strapiUrl: string) {
    super(strapiUrl);
  }

  public static getInstance(strapiUrl: string): SpecificationValueAdapter {
    if (!SpecificationValueAdapter.instance) {
      SpecificationValueAdapter.instance = new SpecificationValueAdapter(
        strapiUrl
      );
    }
    return SpecificationValueAdapter.instance;
  }

  adapt(source: StrapiSpecificationValue): typSpecificationValus {
    return {
      id: source.id,
      name: this.handleNullUndefined(source.value, ""),
      specificationType: source.specification_type
        ? {
            id: source.specification_type.id,
            name: source.specification_type.name,
          }
        : undefined,
      // Don't adapt products here to avoid circular dependencies
    };
  }

  adaptWithProductCount(
    source: StrapiSpecificationValue
  ): typSpecificationValus & { productCount: number } {
    return {
      ...this.adapt(source),
      productCount: source.products?.length || 0,
    };
  }
}
