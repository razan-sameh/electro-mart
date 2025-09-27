import { Link } from "@/i18n/navigation";
import React from "react";

function ProductAds() {
  return (
    <section className="relative w-full h-[30vh] bg-gray-100">
      {/* Background image */}
      <img
        src="/ads/ads1.png"
        alt="ads1"
        className="w-full h-full object-cover"
      />

      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col justify-center items-end p-6">
        <div className="flex flex-col items-center text-center">
          <span className="text-white text-lg">
            Your next favorite find
          </span>
          <span className="text-white text-lg mb-4">
            is just a click away!
          </span>
          <Link
            href="/categories"
            className="px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition"
          >
            View all
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ProductAds;
