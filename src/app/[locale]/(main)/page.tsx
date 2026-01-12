import SpecialOffers from "./components/SpecialOffers";
import Brands from "./components/Brands";
import Categories from "./components/Categories";
import Hero from "./components/Hero";
import Container from "@/components/ui/Container";
import Features from "./components/Features";
import ProductAds from "./components/ProductAds";

export default function Home() {
  return (
    <div className="bg-background">
      <Hero />
      <Container>
        {/* <SpecialOffers /> */}
        <Features />
        <Categories />
        <ProductAds />
        <Brands />
      </Container>
    </div>
  );
}
