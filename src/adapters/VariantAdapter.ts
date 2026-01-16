// File: adapters/BrandAdapter.ts
import { typProductSpec, typProductVariant } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { ProductSpecDB, ProductVariantDB } from "./interfaces/types";
import { AttributesAdapter } from "./AttributesAdapter";
import { SpecialOfferAdapter } from "./SpecialOfferAdapter";

export class VariantAdapter extends BaseAdapter<
  ProductVariantDB,
  typProductVariant
> {
  private static instance: VariantAdapter;
  private attributesAdapter: AttributesAdapter;
  private specialOfferAdapter: SpecialOfferAdapter;

  private constructor() {
    super();
    this.attributesAdapter = AttributesAdapter.getInstance();
    this.specialOfferAdapter = SpecialOfferAdapter.getInstance();
  }

  public static getInstance(): VariantAdapter {
    if (!VariantAdapter.instance) {
      VariantAdapter.instance = new VariantAdapter();
    }
    return VariantAdapter.instance;
  }

  adapt(source: ProductVariantDB): typProductVariant {
    return {
      id: source.id,
      sku: this.handleNullUndefined(source.sku, ""),
      attributes: this.attributesAdapter.adaptMany(source.attributes || []),
      offer: this.specialOfferAdapter.adapt(source.offer || {}),
      price: this.handleNullUndefined(source.price, 0),
      stock: this.handleNullUndefined(source.stock, 0),
      is_active: source.is_active,
    };
  }
}
