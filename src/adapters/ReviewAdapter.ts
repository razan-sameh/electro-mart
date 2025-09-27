// File: adapters/BrandAdapter.ts
import { typBrand, typReview } from "@/content/types";
import { BaseAdapter } from './base/BaseAdapter';
import { StrapiReview } from "./interfaces/types";

export class ReviewAdapter extends BaseAdapter<StrapiReview, typReview> {
  private static instance: ReviewAdapter;

  private constructor(strapiUrl: string) {
    super(strapiUrl);
  }

  public static getInstance(strapiUrl: string): ReviewAdapter {
    if (!ReviewAdapter.instance) {
      ReviewAdapter.instance = new ReviewAdapter(strapiUrl);
    }
    return ReviewAdapter.instance;
  }

  adapt(source: StrapiReview): typReview {
    return {
    id: source.documentId,
    rating: this.handleNullUndefined(source.Rating, 0),
    comment: this.handleNullUndefined(source.Comment, ''),
    user: {
        id: "",
        username: "",
        email: "",
        token: undefined
    },
    createdAt:this.handleNullUndefined(source.createdAt, ''),
    updatedAt:this.handleNullUndefined(source.updatedAt, '')
};
  }
}