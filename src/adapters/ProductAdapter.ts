import { typProduct } from "@/content/types";
import { BaseAdapter } from "./base/BaseAdapter";
import { StrapiProduct } from "./interfaces/types";
import { BrandAdapter } from "./BrandAdapter";
import { CategoryAdapter } from "./CategoryAdapter";
import { SpecialOfferAdapter } from "./SpecialOfferAdapter";
import { ColorAdapter } from "./ColorAdapter";
import { SpecificationValueAdapter } from "./SpecificationValueAdapter";
import { ReviewAdapter } from "./ReviewAdapter";

export class ProductAdapter extends BaseAdapter<StrapiProduct, typProduct> {
  private static instance: ProductAdapter;
  private categoryAdapter: CategoryAdapter;
  private brandAdapter: BrandAdapter;
  private specialOfferAdapter: SpecialOfferAdapter;
  private colorAdapter: ColorAdapter;
  private reviewAdapter: ReviewAdapter;
  private specificationValueAdapter: SpecificationValueAdapter;

  private constructor(strapiUrl: string) {
    super(strapiUrl);
    this.categoryAdapter = CategoryAdapter.getInstance(strapiUrl);
    this.brandAdapter = BrandAdapter.getInstance(strapiUrl);
    this.specialOfferAdapter = SpecialOfferAdapter.getInstance(strapiUrl);
    this.colorAdapter = ColorAdapter.getInstance(strapiUrl);
    this.reviewAdapter = ReviewAdapter.getInstance(strapiUrl);
    this.specificationValueAdapter =
      SpecificationValueAdapter.getInstance(strapiUrl);
  }

  public static getInstance(strapiUrl: string): ProductAdapter {
    if (!ProductAdapter.instance) {
      ProductAdapter.instance = new ProductAdapter(strapiUrl);
    }
    return ProductAdapter.instance;
  }

  adapt(source: StrapiProduct): typProduct {
    return {
      id: source.documentId,
      name: this.handleNullUndefined(source.Name, ""),
      description: this.handleNullUndefined(source.Description, ""),
      price: this.handleNullUndefined(source.Price, 0),
      stockQuantity: this.handleNullUndefined(source.StockQuantity, 0),
      averageRating: this.handleNullUndefined(source.averageRating, 0),
      totalReviews: this.handleNullUndefined(source.totalReviews, 0),
      imagesUrl: this.adaptImageUrls(source.ImageURL),
      brand: this.brandAdapter.adapt(source.brand),
      category:  this.categoryAdapter.adapt(source.category),
      specialOffers: this.specialOfferAdapter.adaptMany(
        source.special_offers || []
      ),
      colors: this.colorAdapter.adaptMany(source.product_colors || []),
      reviews: this.reviewAdapter.adaptMany(source.reviews || []),
      specificationValues: this.specificationValueAdapter.adaptMany(
        source.specification_values || []
      ),
    };
  }
}
