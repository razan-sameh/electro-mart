"use client";

import { useEffect, useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileSchema, typProfileData } from "./schemas";
import { BsPencilSquare } from "react-icons/bs";
import { FiCheck, FiX } from "react-icons/fi";
import InputField from "@/components/reusable/InputField";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "@/i18n/navigation";
import { typPhone } from "@/content/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Loader from "@/components/ui/Loader";
import toast from "react-hot-toast";

export default function ProfileForm() {
  const [editingFields, setEditingFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoading: userLoading } = useAuth();
  const router = useRouter();

  const form = useForm<typProfileData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone,
      password: "********",
    },
  });

  // ✅ watch for live changes in phone
  const { watch, reset, setValue, register, formState } = form;
  const phoneValue = watch("phone");

  // ✅ rebuild display string dynamically
  const phoneString = phoneValue
    ? `${phoneValue.dialCode}${phoneValue.number}`
    : "";

  // ✅ update form when user changes (from useAuth)
  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        phone: user.phone,
        password: "********",
      });
    }
  }, [user, reset]);

  const handleSave = async (field: keyof typProfileData) => {
    let value = form.getValues(field);
    setIsLoading(true);

    try {
      const payload: Record<string, any> = {};

      if (field === "phone") {
        const phone: typPhone = form.getValues("phone");
        payload.phone = {
          dailcode: phone.dialCode,
          number: phone.number,
          countryCode: phone.countryCode || "",
        };
      } else {
        const cleanValue = String(value)
          .replace(/[\u202A-\u202E\u200E\u200F]/g, "")
          .trim();
        payload[field] = cleanValue;
      }

      const res = await fetch("/api/auth/update-user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update profile");
      toast.success(`${field} updated successfully!`);
      setEditingFields((prev) => prev.filter((f) => f !== field));
      setValue(field, value);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = (field: keyof typProfileData) => {
    if (user) {
      setValue(
        field,
        field === "phone"
          ? {
              dialCode: user.phone?.dialCode || "",
              number: user.phone?.number || "",
              countryCode: user.phone?.countryCode || "",
            }
          : (user as any)[field] || ""
      );
    }
    setEditingFields((prev) => prev.filter((f) => f !== field));
  };

  const handlePassword = () => router.push("/profile/change-password");

  const toggleEditing = (field: keyof typProfileData) => {
    setEditingFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  if (userLoading) {
    return <LoadingSpinner />;
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-background p-6 rounded-2xl shadow-sm"
    >
      {Object.entries(form.getValues()).map(([key]) => {
        const isEditing = editingFields.includes(key);
        const fieldLabels: Record<string, string> = {
          username: "User name",
          email: "Email",
          phone: "Phone number",
          password: "Password",
        };

        return (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-medium text-content mb-1">
              {fieldLabels[key] || key}
            </label>
            <InputField
              canShowPassword={false}
              placeholder={fieldLabels[key] || key}
              register={register}
              name={key as keyof typProfileData}
              type={key === "password" ? "password" : "text"}
              error={
                key === "phone"
                  ? (formState.errors.phone?.number as FieldError) ||
                    (formState.errors.phone?.dialCode as FieldError) ||
                    (formState.errors.phone?.countryCode as FieldError)
                  : (formState.errors[
                      key as keyof typProfileData
                    ] as FieldError)
              }
              readOnly={!isEditing}
              iconAction={
                isEditing ? (
                  <div className="flex items-center gap-2 min-w-[40px]">
                    {isLoading ? (
                      <Loader size={18} />
                    ) : (
                      <>
                        <FiCheck
                          className="text-green-600 cursor-pointer"
                          size={18}
                          onClick={() =>
                            handleSave(key as keyof typProfileData)
                          }
                        />
                        <FiX
                          className="text-red-500 cursor-pointer"
                          size={18}
                          onClick={() =>
                            handleCancel(key as keyof typProfileData)
                          }
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <BsPencilSquare
                    size={18}
                    className="cursor-pointer"
                    onClick={() =>
                      key === "password"
                        ? handlePassword()
                        : toggleEditing(key as keyof typProfileData)
                    }
                  />
                )
              }
              isPhone={key === "phone"}
              setValue={setValue}
              value={
                key === "phone"
                  ? phoneString // ✅ dynamic string from watch
                  : String(form.getValues(key as keyof typProfileData) ?? "")
              }
            />
          </div>
        );
      })}
    </form>
  );
}
