"use client";

import { useSearchParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaMapMarkerAlt, FaFlag, FaCity, FaMailBulk } from "react-icons/fa";
import InputField from "@/components/reusable/InputField";
import CartSummary from "@/components/reusable/CartSummary";
import { typAddressFormData, AddressSchema } from "./schema";
import { useTranslations } from "next-intl";
import { useCart } from "@/lib/hooks/useCart";
import { useDraftOrderId, useUpdateShipping } from "@/lib/hooks/useCheckout";
import { useOrderById } from "@/lib/hooks/useOrders";
import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";

export default function AddressForm() {
  const t = useTranslations("Checkout");
  const searchParams = useSearchParams();
  const { cart } = useCart();
  const { data: draftOrderId } = useDraftOrderId();
  const { data: order } = useOrderById(draftOrderId);
  const { mutateAsync: UpdateShipping, isPending } = useUpdateShipping();
  const isBuyNow = searchParams.get("isBuyNow") === "1";
  const productId = searchParams.get("productId");
  const variantId = searchParams.get("variantId");
  const quantity = searchParams.get("quantity");
  const itemsToCheckout =
    isBuyNow && productId && variantId && quantity
      ? (cart?.items ?? [])
          .filter(
            (item) =>
              item.product.id === Number(productId) &&
              item.variant.id === Number(variantId),
          )
          .map((item) => ({ ...item, quantity: Number(quantity) }))
      : (cart?.items ?? []);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
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
  useEffect(() => {
    if (order) {
      reset({
        phone: order.phone || {},
        country: order.shippingAddress?.country || "",
        city: order.shippingAddress?.city || "",
        postalCode: order.shippingAddress?.postalCode || "",
        streetAddress: order.shippingAddress?.streetAddress || "",
      });
    }
  }, [reset, draftOrderId, order]);

  const phoneValue = watch("phone");
  const phoneString = phoneValue
    ? `${phoneValue.dialCode}${phoneValue.number}`
    : "";

  const onSubmit: SubmitHandler<typAddressFormData> = async (data) => {
    const { city, country, postalCode, streetAddress, phone } = data;

    UpdateShipping({
      items: itemsToCheckout,
      shippingAddress: {
        country,
        city,
        postalCode,
        streetAddress,
      },
      phone: {
        countryCode: phone.countryCode,
        dialCode: `+${phone.dialCode}`,
        number: phone.number,
      },
      orderId: draftOrderId,
    }).then(() => {
      if (isBuyNow) {
        router.push(
          `/checkout/payment?isBuyNow=1&productId=${itemsToCheckout[0].product.id}&variantId=${itemsToCheckout[0].variant.id}&quantity=${itemsToCheckout[0].quantity}`,
        );
      } else {
        router.push("/checkout/payment");
      }
    });
  };

  // Fix: handleSubmit returns a function
  const handleFormSubmit = handleSubmit(onSubmit);
  if (!draftOrderId) return <div>Loading...</div>;

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
          quantity={isBuyNow ? Number(quantity) : undefined}
        />
      </div>
    </div>
  );
}
