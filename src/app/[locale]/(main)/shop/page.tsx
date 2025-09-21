import ProductCard from "@/components/reusable/ProductCard";
import Filters from "./components/Filters";
import { typProduct } from "@/content/types";
import { enmDiscountType } from "@/content/enums";

const products: typProduct[] = [
  {
    id: 1,
    name: "HP Laptop with Intel Core i7",
    description: "Intel Core i7 | 16GB RAM | 1TB SSD | 14'' WQXGA",
    imageUrl: "/laptops/hp-i7.png",
    price: 1299,
    stockQuantity: 20,
    brand: { id: 1, name: "HP" }, // لازم brand
    category: { id: 1, name: "Laptops" },
    specialOffers: [
      {
        id: 1,
        title: "Back to School",
        discountType: enmDiscountType.percentage,
        discountValue: 15,
        startDate: "2025-09-01",
        endDate: "2025-09-30",
      },
    ],
  },
  {
    id: 2,
    name: "Dell XPS 13 (2024)",
    description: "13.4-inch Full HD display, Intel Core i7, 16GB RAM, 512GB SSD",
    imageUrl: "/laptops/dell-xps-13.png",
    price: 1399,
    stockQuantity: 15,
    brand: { id: 2, name: "Dell" },
    category: { id: 1, name: "Laptops" },
  },
];


export default function ShopPage() {
  return (
    <div className="flex gap-6 px-6 py-8">
      {/* Sidebar Filters */}
      <aside className="w-64 shrink-0">
        <Filters />
      </aside>

      {/* Product Grid */}
      <main className="flex-1">
        <h1 className="text-2xl font-semibold mb-4">
          Explore All Windows Laptops
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item: typProduct) => (
            <ProductCard
              key={item.id}
              title={item.name}
              offer={item.specialOffers?.[0]}
              price={item.price}
              img={item.imageUrl}
              rating={5}
              reviews={10}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
