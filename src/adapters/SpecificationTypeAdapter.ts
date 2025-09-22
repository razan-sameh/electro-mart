// File: adapters/BrandAdapter.ts
import { typSpecificationType } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { StrapiSpecificationType } from "./interfaces/types";
import { SpecificationValueAdapter } from "./SpecificationValueAdapter";

export class SpecificationTypeAdapter extends BaseAdapter<
  StrapiSpecificationType,
  typSpecificationType
> {
  private static instance: SpecificationTypeAdapter;
  private specificationValueAdapter: SpecificationValueAdapter;

  private constructor(strapiUrl: string) {
    super(strapiUrl);
    this.specificationValueAdapter =
      SpecificationValueAdapter.getInstance(strapiUrl);
  }

  public static getInstance(strapiUrl: string): SpecificationTypeAdapter {
    if (!SpecificationTypeAdapter.instance) {
      SpecificationTypeAdapter.instance = new SpecificationTypeAdapter(
        strapiUrl
      );
    }
    return SpecificationTypeAdapter.instance;
  }

  adapt(source: StrapiSpecificationType): typSpecificationType {
    return {
      id: source.id,
      name: this.handleNullUndefined(source.name, ""),
      specificationValues: source.specification_values
        ? this.specificationValueAdapter.adaptMany(
            source.specification_values
          )
        : undefined,
    };
  }

  adaptWithCategoryCount(
    source: StrapiSpecificationType
  ): typSpecificationType & { categoryCount: number } {
    return {
      ...this.adapt(source),
      categoryCount: source.categories?.length || 0,
    };
  }
}
