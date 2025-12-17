import { typCategory } from "@/content/types";
import { BaseAdapter } from './base/BaseAdapter';
import { StrapiCategory } from "./interfaces/types";
import { SpecificationTypeAdapter } from "./SpecificationTypeAdapter";

export class CategoryAdapter extends BaseAdapter<StrapiCategory, typCategory> {
  private static instance: CategoryAdapter;
  private specificationTypeAdapter: SpecificationTypeAdapter;

  private constructor() {
    super();
    this.specificationTypeAdapter = SpecificationTypeAdapter.getInstance();
  }

  public static getInstance(): CategoryAdapter {
    if (!CategoryAdapter.instance) {
      CategoryAdapter.instance = new CategoryAdapter();
    }
    return CategoryAdapter.instance;
  }

  adapt(source: StrapiCategory): typCategory {
    return {
      id: source.documentId,
      // Handle both possible field names
      name: this.handleNullUndefined(source.CategoryName || source.name, ''),
      icon: source.icon,
      imageUrl: this.adaptImageUrlSingle(source.ImageURL || source.LogoURL),
      specificationTypes: source.specification_types ? this.specificationTypeAdapter.adaptMany(source.specification_types) : undefined,
    };
  }
}