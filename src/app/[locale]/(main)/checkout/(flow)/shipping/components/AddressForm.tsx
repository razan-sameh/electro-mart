"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaMapMarkerAlt, FaFlag, FaCity, FaMailBulk } from "react-icons/fa";
import InputField from "@/components/reusable/InputField";
import CartSummary from "@/components/reusable/CartSummary";
import { typAddressFormData, AddressSchema } from "./schema";
import { useUnifiedCart } from "@/hooks/useUnifiedCart";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useBuyNow } from "@/lib/hooks/useBuyNow";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function AddressForm() {
  const t = useTranslations("Checkout");
  const router = useRouter();
  const searchParams = useSearchParams();

  const { cartItems } = useUnifiedCart();
  const { data: buyNowItems } = useBuyNow();
  const { setShippingAddress, shippingAddress } = useCheckoutStore();

  const isBuyNow = searchParams.get("isBuyNow") === "1";
  const itemsToCheckout = isBuyNow ? buyNowItems! : cartItems;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<typAddressFormData>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      phone: shippingAddress?.phone,
      country: shippingAddress?.country || "",
      city: shippingAddress?.city || "",
      postalCode: shippingAddress?.postalCode || "",
      streetAddress: shippingAddress?.streetAddress || "",
    },
  });

  const phoneValue = watch("phone");

  // Convert phone object to string for display
  const phoneString = phoneValue
    ? `${phoneValue.dialCode}${phoneValue.number}`
    : "";

  const onSubmit = (data: typAddressFormData) => {
    setShippingAddress(data);
    if (isBuyNow) {
      router.push("/checkout/payment?isBuyNow=1");
    } else {
      router.push("/checkout/payment");
    }
  };

  return (
    <div className="grid lg:grid-cols-[2fr_1fr] gap-6 mt-6">
      {/* LEFT SIDE — Address Form Fields */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        id="address-form"
      >
        <h2 className="text-xl font-semibold mb-4">{t("deliveryDetails")}</h2>

        <InputField
          placeholder={t("phoneNumber")}
          register={register}
          name="phone"
          error={
            errors.phone?.number || // ✅ main field check
            errors.phone?.dialCode ||
            errors.phone?.countryCode
          }
          isPhone
          setValue={setValue}
          value={phoneString}
        />

        <InputField
          placeholder={t("country")}
          icon={FaFlag}
          register={register}
          name="country"
          error={errors.country}
        />
        <InputField
          placeholder={t("city")}
          icon={FaCity}
          register={register}
          name="city"
          error={errors.city}
        />
        <InputField
          placeholder={t("postalCode")}
          icon={FaMailBulk}
          register={register}
          name="postalCode"
          error={errors.postalCode}
        />
        <InputField
          placeholder={t("streetAddress")}
          icon={FaMapMarkerAlt}
          register={register}
          name="streetAddress"
          error={errors.streetAddress}
        />
      </form>

      {/* RIGHT SIDE — Cart Summary */}
      <div className="self-start">
        <CartSummary
          items={itemsToCheckout ?? []}
          buttonText={t("continueButton")}
          onButtonClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
}
