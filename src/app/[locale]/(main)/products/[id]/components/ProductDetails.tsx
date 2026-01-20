"use client";
import { useProductsById } from "@/lib/hooks/useProducts";
import ProductInfo from "./ProductInfo";
import ProductImages from "./ProductImages";
import ProductSpecs from "./ProductSpecs";
import ProductReviews from "./ProductReviews";
import SimilarProducts from "./SimilarProducts";
import ProductAccessories from "./ProductAccessories";
import ProductAds from "./ProductAds";
import { useTranslations } from "next-intl";

interface ProductDetailsProps {
  productId: number;
}

export default function ProductDetails({ productId }: ProductDetailsProps) {
  const { data: product } = useProductsById(productId);
  const t = useTranslations("ProductDetails");

  return (
    <div className="mx-auto py-8 space-y-12">
      {/* Images + Info */}
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <ProductImages images={product?.imagesUrl!} name={product?.name!} />
        </div>
        <div className="flex-1">
          <ProductInfo product={product!} />
        </div>
      </div>

      {/* Description + Specifications */}
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">{t("description")}</h2>
          <p>{product?.description}</p>
        </div>
        {product?.specs?.length ? (
          <div className="flex-1">
            <ProductSpecs specs={product.specs} />
          </div>
        ) : null}
      </div>

      {/* Extra sections */}
      {/* <ProductReviews productId={productId} averageRating={product?.averageRating!} /> */}
      <SimilarProducts product={product!} />
      <ProductAds />
      <ProductAccessories />
    </div>
  );
}
