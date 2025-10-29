"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFlag,
  FaCity,
  FaMailBulk,
} from "react-icons/fa";
import InputField from "@/components/reusable/InputField";
import CartSummary from "@/components/reusable/CartSummary";
import { typAddressData, AddressSchema } from "./schema";

interface AddressFormProps {
  initial?: typAddressData | null;
  onNext: (data: typAddressData) => void;
  items: any[]; // 🧩 cart items passed from parent
}

export default function AddressForm({
  initial,
  onNext,
  items,
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    setValue, // ✅ add this line
    formState: { errors },
  } = useForm<typAddressData>({
    resolver: zodResolver(AddressSchema),
    defaultValues: initial || {},
  });

  // ✅ Instead of form submit button, we’ll trigger this manually from CartSummary
  const onSubmit = (data: typAddressData) => {
    onNext(data);
  };

  return (
    <div className="grid lg:grid-cols-[2fr_1fr] gap-6 mt-6">
      {/* LEFT SIDE — Address Form Fields */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        id="address-form"
      >
        <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>

        <InputField
          placeholder="Phone number"
          register={register}
          name="phone"
          error={errors.phone}
          isPhone
          setValue={setValue} // ✅ add this line
          value={initial?.phone} 
        />
        <InputField
          placeholder="Country"
          icon={FaFlag}
          register={register}
          name="country"
          error={errors.country}
        />
        <InputField
          placeholder="City / Place"
          icon={FaCity}
          register={register}
          name="city"
          error={errors.city}
        />
        <InputField
          placeholder="Postal code"
          icon={FaMailBulk}
          register={register}
          name="postalCode"
          error={errors.postalCode}
        />
        <InputField
          placeholder="Street address"
          icon={FaMapMarkerAlt}
          register={register}
          name="streetAddress"
          error={errors.streetAddress}
        />
      </form>

      {/* RIGHT SIDE — Cart Summary with external button */}
      <div className="self-start">
        <CartSummary
          items={items}
          buttonText="Continue"
          onButtonClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
}
