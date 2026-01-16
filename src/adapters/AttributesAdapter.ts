import { typProductAttribute } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { ProductAttributeDB } from "./interfaces/types";

export class AttributesAdapter extends BaseAdapter<
  ProductAttributeDB,
  typProductAttribute
> {
  private static instance: AttributesAdapter;

  private constructor() {
    super();
  }

  public static getInstance(): AttributesAdapter {
    if (!AttributesAdapter.instance) {
      AttributesAdapter.instance = new AttributesAdapter();
    }
    return AttributesAdapter.instance;
  }

  adapt(source: ProductAttributeDB): typProductAttribute {
    return {
      id: this.handleNullUndefined(source.id, 0),
      attribute: this.handleNullUndefined(source.attribute, ""),
      hex_code: this.handleNullUndefined(source.hexCode, ""),
      value: this.handleNullUndefined(source.value, ""),
    };
  }
}
