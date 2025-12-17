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

  private constructor() {
    super();
    this.specificationValueAdapter =
      SpecificationValueAdapter.getInstance();
  }

  public static getInstance(): SpecificationTypeAdapter {
    if (!SpecificationTypeAdapter.instance) {
      SpecificationTypeAdapter.instance = new SpecificationTypeAdapter(
        
      );
    }
    return SpecificationTypeAdapter.instance;
  }

  adapt(source: StrapiSpecificationType): typSpecificationType {
    return {
      id: source.documentId,
      name: this.handleNullUndefined(source.name, ""),
      specificationValues: source.specification_values
        ? this.specificationValueAdapter.adaptMany(
            source.specification_values
          )
        : undefined,
    };
  }
}
