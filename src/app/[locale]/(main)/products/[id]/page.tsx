// app/[locale]/products/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Product ${id} - MyShop`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  // Replace with real fetch
  const product = {
    id,
    name: "HP Laptop with Intel Core i7",
    price: 1200,
    images: [
      "/laptop-1.jpg",
      "/laptop-2.jpg",
      "/laptop-3.jpg",
    ],
    specs: {
      processor: "Intel Core i7",
      ram: "16GB DDR4",
      storage: "512GB SSD",
      display: "15.6'' FHD",
      os: "Windows 11",
    },
    description:
      "The HP Laptop is designed for everyday productivity and seamless multitasking...",
    reviews: [
      { id: 1, name: "John D.", rating: 5, text: "Excellent laptop for work and gaming." },
      { id: 2, name: "Sara K.", rating: 4, text: "Good performance but battery could be better." },
    ],
    similar: [
      { id: "2", name: "Dell XPS 13", price: 1300, image: "/dell-xps.jpg" },
      { id: "3", name: "Lenovo ThinkPad", price: 1100, image: "/lenovo.jpg" },
    ],
    addons: [
      { id: "101", name: "Wireless Mouse", price: 25, image: "/mouse.jpg" },
      { id: "102", name: "Laptop Bag", price: 40, image: "/bag.jpg" },
    ],
  };

  if (!product) return notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={600}
            height={400}
            className="rounded-lg shadow-md"
          />
          <div className="flex gap-2 mt-4">
            {product.images.map((img, i) => (
              <Image
                key={i}
                src={img}
                alt={`${product.name} ${i}`}
                width={100}
                height={80}
                className="rounded-md border cursor-pointer hover:scale-105 transition"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-xl font-semibold text-blue-600 mt-2">${product.price}</p>

          {/* Variants (example colors) */}
          <div className="mt-4">
            <span className="block font-semibold">Color:</span>
            <div className="flex gap-2 mt-2">
              <button className="w-8 h-8 rounded-full bg-black border"></button>
              <button className="w-8 h-8 rounded-full bg-gray-400 border"></button>
              <button className="w-8 h-8 rounded-full bg-blue-500 border"></button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
              Add to Cart
            </button>
            <button className="px-6 py-3 bg-gray-200 rounded-lg shadow hover:bg-gray-300">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Specs */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Product Information & Specifications</h2>
        <table className="w-full border">
          <tbody>
            {Object.entries(product.specs).map(([key, value]) => (
              <tr key={key} className="border-b">
                <td className="p-2 font-medium capitalize">{key}</td>
                <td className="p-2">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Description */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700">{product.description}</p>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">User Ratings & Reviews</h2>
        <div className="space-y-4">
          {product.reviews.map((review) => (
            <div key={review.id} className="p-4 border rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <FaStar key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
                <span className="ml-2 font-medium">{review.name}</span>
              </div>
              <p className="text-gray-600 mt-2">{review.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Similar Products */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Similar Picks for You</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {product.similar.map((sim) => (
            <div key={sim.id} className="border rounded-lg p-4 hover:shadow-md">
              <Image src={sim.image} alt={sim.name} width={200} height={150} />
              <h3 className="mt-2 font-medium">{sim.name}</h3>
              <p className="text-blue-600 font-semibold">${sim.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add-ons */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Add these accessories to your order</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {product.addons.map((addon) => (
            <div key={addon.id} className="border rounded-lg p-4 hover:shadow-md">
              <Image src={addon.image} alt={addon.name} width={200} height={150} />
              <h3 className="mt-2 font-medium">{addon.name}</h3>
              <p className="text-blue-600 font-semibold">${addon.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
