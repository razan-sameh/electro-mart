import { typProduct } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { ProductDB } from "./interfaces/types";
import { BrandAdapter } from "./BrandAdapter";
import { CategoryAdapter } from "./CategoryAdapter";
import { SpecialOfferAdapter } from "./SpecialOfferAdapter";
import {  SpecificationAdapter } from "./SpecificationAdapter";
import { VariantAdapter } from "./VariantAdapter";
import { AttributesAdapter } from "./AttributesAdapter";

export class ProductAdapter extends BaseAdapter<ProductDB, typProduct> {
  private static instance: ProductAdapter;
  private categoryAdapter: CategoryAdapter;
  private brandAdapter: BrandAdapter;
  private specialOfferAdapter: SpecialOfferAdapter;
  private specificationAdapter: SpecificationAdapter;
  private variantAdapter: VariantAdapter;
  private attributesAdapter: AttributesAdapter;

  private constructor() {
    super();
    this.categoryAdapter = CategoryAdapter.getInstance();
    this.brandAdapter = BrandAdapter.getInstance();
    this.specialOfferAdapter = SpecialOfferAdapter.getInstance();
    this.specificationAdapter = SpecificationAdapter.getInstance();
    this.variantAdapter = VariantAdapter.getInstance();
    this.attributesAdapter = AttributesAdapter.getInstance();
  }

  public static getInstance(): ProductAdapter {
    if (!ProductAdapter.instance) {
      ProductAdapter.instance = new ProductAdapter();
    }
    return ProductAdapter.instance;
  }

  adapt(source: ProductDB): typProduct {
    return {
      id: source.id,
      slug: source.slug,
      defaultVariantId: source.default_variant_id,
      name: this.handleNullUndefined(source.title, ""),
      description: this.handleNullUndefined(source.description, ""),
      displayPrice: this.handleNullUndefined(source.display_price, 0),
      originalPrice: this.handleNullUndefined(source.original_price, 0),
      averageRating: this.handleNullUndefined(source.averageRating, 0),
      totalReviews: this.handleNullUndefined(source.totalReviews, 0),
      imagesUrl: source.images || [],
      brand: source.brand
        ? this.brandAdapter.adapt(source.brand)
        : { id: 0, name: "" },
      category: source.category
        ? this.categoryAdapter.adapt(source.category)
        : { id: 0, name: "" },
      specialOffers: this.specialOfferAdapter.adapt(source.offer || {}),
      specs: this.specificationAdapter.adaptMany(source.specs || []),
      variants: this.variantAdapter.adaptMany(source.variants || []),
      defaultVariantAttributes: this.attributesAdapter.adaptMany(source.default_variant_attributes || []),
    };
  }
}
