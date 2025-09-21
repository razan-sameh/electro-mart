'use client'
import { useTranslations } from "next-intl";
import SectionHeader from "./SectionHeader";
import ProductCard from "@/components/reusable/ProductCard";

const bestSellers = [
  {
    id: 1,
    title: "Philips Airfryer XL",
    price: 99,
    oldPrice: "140 €",
    img: "/best/airfryer.png",
    discount: "-30%",
    rating: 4.8,
    reviews: 120,
  },
  {
    id: 2,
    title: "Xiaomi Watch",
    price: 99,
    img: "/best/watch.png",
    rating: 4.8,
    reviews: 120,
  },
  {
    id: 3,
    title: "iPhone 15 128GB",
    price: 999,
    img: "/best/iphone.png",
    rating: 4.8,
    reviews: 120,
  },
  {
    id: 4,
    title: "Sony WH-1000XM4",
    price: 399,
    img: "/best/sony.png",
    rating: 4.8,
    reviews: 120,
  },
];

export default function BestSellers() {
  const t = useTranslations("HomeSection");

  return (
    <section className="py-8">
      <SectionHeader title={t("bestSellersTitle")} linkText={t("viewAll")} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {bestSellers.map((item) => (
          <ProductCard
            key={item.id}
            title={item.title}
            discount={item.discount}
            price={item.price}
            img={item.img}
            rating={item.rating}
            reviews={item.reviews}
          />
        ))}
      </div>
    </section>
  );
}
