'use client'
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ProfileForm from "./ProfileForm";

export default function Profile() {
  const t = useTranslations("Profile");

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>

      <ProfileForm />

      {/* Advertisement Section */}
      <div className="relative w-full h-[30vh] bg-gray-100">

        <img
          src="/ads/offers.png"
          alt="ads background"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 flex flex-col justify-center items-center p-6">
          <div className="max-w-md">
            <h2 className="text-2xl font-semibold p-4 text-gray-700">
              {t("customerClubTitle")}
            </h2>

            <p className="text-md text-gray-700 pb-4">
              {t("customerClubDesc")}
            </p>
          </div>

          <Link
            href="/categories?specialOffer=true"
            className="p-4 md:mt-0 bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition"
          >
            {t("seeOffers")}
          </Link>
        </div>
      </div>
    </div>
  );
}
