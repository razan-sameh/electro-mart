// File: adapters/BrandAdapter.ts
import { typBrand, typReview } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { StrapiReview } from "./interfaces/types";
import { UserAdapter } from "./UserAdapter";

export class ReviewAdapter extends BaseAdapter<StrapiReview, typReview> {
  private static instance: ReviewAdapter;
  private userAdapter: UserAdapter;

  private constructor() {
    super();
    this.userAdapter = UserAdapter.getInstance();
  }

  public static getInstance(): ReviewAdapter {
    if (!ReviewAdapter.instance) {
      ReviewAdapter.instance = new ReviewAdapter();
    }
    return ReviewAdapter.instance;
  }

  adapt(source: StrapiReview): typReview {
    return {
      id: source.id,
      documentId: source.documentId,
      rating: this.handleNullUndefined(source.Rating, 0),
      comment: this.handleNullUndefined(source.Comment, ""),
      user: this.userAdapter.adapt(source.user),
      createdAt: this.handleNullUndefined(source.createdAt, ""),
      updatedAt: this.handleNullUndefined(source.updatedAt, ""),
    };
  }
}
