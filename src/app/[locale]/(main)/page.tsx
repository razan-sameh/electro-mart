import Features from "@/app/[locale]/(main)/components/Features";
import ProductAds from "@/app/[locale]/(main)/components/ProductAds";
import { Suspense } from "react";
import SpecialOffers from "./components/SpecialOffers";
import Brands from "./components/Brands";
import Categories from "./components/Categories";
import Hero from "./components/Hero";
import Container from "@/components/ui/Container";

export default function Home() {
  return (
    <div className="bg-background">
      <Hero />
      <Container>
        <SpecialOffers />
        <Features />
        <Categories />
        <ProductAds />
        <Brands />
      </Container>
    </div>
  );
}
