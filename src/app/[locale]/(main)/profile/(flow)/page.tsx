import { Link } from "@/i18n/navigation";
import ProfileForm from "./components/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Personal data</h1>
      <ProfileForm />

      {/* Advertisement Section */}
      <div className="relative w-full h-[30vh] bg-gray-100">
        {/* Background image */}
        <img
          src="/ads/offers.png"
          alt="ads background"
          className="w-full h-full object-cover"
        />

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center p-6">
          <div className="max-w-md">
            <h2 className="text-2xl font-semibold p-4 text-gray-700">
              ELECTRIC.MART Customer Club
            </h2>
            <p className="text-md text-gray-700 pb-4">
              Membership in Electric.mart’s Customer Club entitles you to discounts
              on selected member purchases, as well as early access to our
              offers.
            </p>
          </div>

          <Link href="/categories?specialOffer=true" className=" p-4 md:mt-0 bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition">
            See offers
          </Link>
        </div>
      </div>
    </div>
  );
}
