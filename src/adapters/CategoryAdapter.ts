import { typCategory } from "@/content/types";
import { BaseAdapter } from './base/BaseAdapter';
import { SpecificationTypeAdapter } from "./SpecificationTypeAdapter";
import { CategoryDB } from "./interfaces/types";

export class CategoryAdapter extends BaseAdapter<CategoryDB, typCategory> {
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

  adapt(source: CategoryDB): typCategory {
    return {
      id: source.id,
      name: source.title,
      icon: source.icon,
      imageUrl: source.image_url || "",
      specificationTypes: source.specification_types ? this.specificationTypeAdapter.adaptMany(source.specification_types) : undefined,
    };
  }
}