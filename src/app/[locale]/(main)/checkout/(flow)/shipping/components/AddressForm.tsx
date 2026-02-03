"use client";

import { useSearchParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaMapMarkerAlt, FaFlag, FaCity, FaMailBulk } from "react-icons/fa";
import InputField from "@/components/reusable/InputField";
import CartSummary from "@/components/reusable/CartSummary";
import { typAddressFormData, AddressSchema } from "./schema";
import { useBuyNow } from "@/lib/hooks/useBuyNow";
import { useTranslations } from "next-intl";
import { useCart } from "@/lib/hooks/useCart";
import { useDraftOrderId, useUpdateShipping } from "@/lib/hooks/useCheckout";

export default function AddressForm() {
  const t = useTranslations("Checkout");
  const searchParams = useSearchParams();
  const { cart } = useCart();
  const { data: draftOrderId, isLoading : isDraftOrderIdLoading } = useDraftOrderId();
  const { mutateAsync: UpdateShipping, isPending } = useUpdateShipping();
  const isBuyNow = searchParams.get("isBuyNow") === "1";
  const itemsToCheckout = cart?.items ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<typAddressFormData>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      phone: {},
      country: "",
      city: "",
      postalCode: "",
      streetAddress: "",
    },
  });

  const phoneValue = watch("phone");
  const phoneString = phoneValue
    ? `${phoneValue.dialCode}${phoneValue.number}`
    : "";

  const onSubmit: SubmitHandler<typAddressFormData> = async (data) => {
    const { city, country, postalCode, streetAddress, phone } = data;

    await UpdateShipping({
      items: itemsToCheckout,
      shippingAddress: {
        country,
        city,
        postalCode,
        streetAddress,
      },
      phone: `${phone.dialCode}${phone.number}`,
      orderId: draftOrderId,
    });
  };

  // Fix: handleSubmit returns a function
  const handleFormSubmit = handleSubmit(onSubmit);

  return (
    <div className="grid lg:grid-cols-[2fr_1fr] gap-6 mt-6">
      {/* LEFT */}
      <form onSubmit={handleFormSubmit} className="space-y-4" id="address-form">
        <h2 className="text-xl font-semibold mb-4">{t("deliveryDetails")}</h2>

        <InputField
          placeholder={t("phoneNumber")}
          register={register}
          name="phone"
          error={
            errors.phone?.number ||
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

      {/* RIGHT */}
      <div className="self-start">
        <CartSummary
          items={itemsToCheckout}
          buttonText={t("continueButton")}
          onButtonClick={handleFormSubmit}
          loading={isPending}
        />
      </div>
    </div>
  );
}
