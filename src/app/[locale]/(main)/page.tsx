
import Features from "@/app/[locale]/(main)/components/Features";
import ProductAds from "@/app/[locale]/(main)/components/ProductAds";
import { Suspense } from "react";
import SpecialOffers from "./components/SpecialOffers";
import Brands from "./components/Brands";
import Categories from "./components/Categories";
import Hero from "./components/Hero";
import Container from "@/components/layout/Container";

export default function Home() {
  return (
    <div className="bg-background">
      <Hero />
      {/* <div className="container m-auto"> */}
        <Container>
        <Suspense fallback={<div>Loading...</div>}>
          <SpecialOffers />
        </Suspense>
        <Features />
        <Suspense fallback={<div>Loading...</div>}>
          <Categories />
        </Suspense>
        <ProductAds />
        {/* <BestSellers /> */}
        <Suspense fallback={<div>Loading...</div>}>
          <Brands />
        </Suspense>
        </Container>
      {/* </div> */}
    </div>
  );
}
