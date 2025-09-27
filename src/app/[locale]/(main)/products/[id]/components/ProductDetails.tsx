"use client";

import { useProductsById } from "@/lib/hooks/useProducts";
import ProductInfo from "./ProductInfo";
import ProductImages from "./ProductImages";
import ProductSpecs from "./ProductSpecs";
import ProductReviews from "./ProductReviews";
import { useReviewsByProductId } from "@/lib/hooks/useReview";
import SimilarProducts from "./SimilarProducts";
import ProductAccessories from "./ProductAccessories";
import ProductAds from "./ProductAds";

interface ProductDetailsProps {
  productId: string;
}

export default function ProductDetails({ productId }: ProductDetailsProps) {
  const { data: product } = useProductsById(productId);
  const { data: reviewsWithMeta } = useReviewsByProductId(productId); // first 5 reviews
  const reviews = reviewsWithMeta?.data || [];

  return (
    <div className="mx-auto py-8 space-y-12">
      {/* Flex container for images + info with consistent spacing */}
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <ProductImages images={product.imagesUrl} name={product.name} />
        </div>
        <div className="flex-1">
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Flex container for Description + Specifications */}
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p>{product.description}</p>
        </div>
        {product?.specificationValues?.length ? (
          <div className="flex-1">
            <ProductSpecs specs={product.specificationValues} />
          </div>
        ) : null}
      </div>

      {/* Optional sections */}
      <ProductReviews reviews={reviews} averageRating={product.averageRating}/>
      <SimilarProducts product={product}/>
      <ProductAds/>
      <ProductAccessories />
    </div>
  );
}