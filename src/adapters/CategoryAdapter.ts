import { typCategory } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { CategoryDB } from "./interfaces/types";

export class CategoryAdapter extends BaseAdapter<CategoryDB, typCategory> {
  private static instance: CategoryAdapter;

  private constructor() {
    super();
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
    };
  }
}