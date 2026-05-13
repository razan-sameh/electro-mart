import { typReview } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { ReviewDB } from "./interfaces/types";
import { AttributesAdapter } from "./AttributesAdapter";
import { VariantAdapter } from "./VariantAdapter";

export class ReviewAdapter extends BaseAdapter<ReviewDB, typReview> {
  private static instance: ReviewAdapter;
  private variantAdapter: VariantAdapter;
  private attributesAdapter: AttributesAdapter;
  private constructor() {
    super();
    this.variantAdapter = VariantAdapter.getInstance();
    this.attributesAdapter = AttributesAdapter.getInstance();
  }

  public static getInstance(): ReviewAdapter {
    if (!ReviewAdapter.instance) {
      ReviewAdapter.instance = new ReviewAdapter();
    }
    return ReviewAdapter.instance;
  }

  adapt(source: ReviewDB): typReview {
    return {
      id: source.id,
      documentId: String(source.id),
      rating: this.handleNullUndefined(source.rating, 0),
      comment: this.handleNullUndefined(source.comment, ""),
      createdAt: this.handleNullUndefined(source.created_at, ""),
      updatedAt: this.handleNullUndefined(source.updated_at, ""),
      userName: this.handleNullUndefined(source.user_name, "Anonymous"),
      variant: this.variantAdapter.adapt(source.variant),
      variantAttributes: this.attributesAdapter.adaptMany(
        source.variant_attributes || [],
      ),
    };
  }
}
