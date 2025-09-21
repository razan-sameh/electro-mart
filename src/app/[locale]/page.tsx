import BestSellers from "@/components/Home/BestSellers";
import Brands from "@/components/Home/Brands";
import Categories from "@/components/Home/Categories";
import Features from "@/components/Home/Features";
import Hero from "@/components/Home/Hero";
import ProductAds from "@/components/Home/ProductAds";
import SpecialOffers from "@/components/Home/SpecialOffers";
import { Suspense } from "react";

export default function Home() {
  return (
    <div>
      <Hero />
      <div className="container m-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <SpecialOffers />
        </Suspense>
        <Features />
        <Suspense fallback={<div>Loading...</div>}>
          <Categories />
        </Suspense>
        <ProductAds />
        <BestSellers />
        <Suspense fallback={<div>Loading...</div>}>
          <Brands />
        </Suspense>
      </div>
    </div>
  );
}
