"use client";
import { useSpecialOffers } from "@/lib/hooks/useProducts";
import { typProduct } from "@/content/types";
import ProductCard from "@/components/reusable/ProductCard";

export default function SpecialOffersProducts() {
  const { data: offersWithMeta } = useSpecialOffers(5);
  const offers = offersWithMeta.data;
  return offers.map((item: typProduct) => (
    <ProductCard item={item} key={item.documentId} />
  ));
}
