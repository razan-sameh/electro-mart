"use client";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type ProductAd = {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  href: string;
};

export default function ProductAds() {
  const t = useTranslations("ProductAds");

  // Get translated ads data
  const ads: ProductAd[] = [
    {
      title: t("ads.0.title"),
      description: t("ads.0.description"),
      image: "/ads/macbook.png",
      buttonText: t("ads.0.buttonText"),
      href: `/register`,
    },
    {
      title: t("ads.1.title"),
      description: t("ads.1.description"),
      image: "/ads/speaker.png",
      buttonText: t("ads.1.buttonText"),
      href: `/categories`,
    },
  ];

  return (
    <section className="grid md:grid-cols-3 gap-6 py-8">
      {ads.map((ad, index) => (
        <div
          key={index}
          className={`relative rounded-lg overflow-hidden flex flex-col justify-end p-6 text-white ${
            index === 0 ? "md:col-span-2" : "md:col-span-1"
          }`}
          style={{
            width: "100%",
            height: "500px",
            backgroundImage: `url(${ad.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Content */}
          <div className="relative z-10 flex items-end justify-between">
            <div>
              <h3 className="text-lg mb-1 font-semibold">{ad.title}</h3>
              <p className="text-sm max-w-xs text-gray-200">{ad.description}</p>
            </div>
            <Link
              href={ad.href}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              {ad.buttonText}
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}
