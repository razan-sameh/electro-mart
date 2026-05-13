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
import { useTranslations } from "next-intl";
import { MdOutlineMarkEmailRead } from "react-icons/md";

export default function ProfileForm() {
  const t = useTranslations("Profile");

  const [editingFields, setEditingFields] = useState<string[]>([]);
  // Track per-field loading instead of a single global flag
  const [loadingFields, setLoadingFields] = useState<string[]>([]);
  const { user, isLoading: userLoading } = useAuth();
  const router = useRouter();

  const form = useForm<typProfileData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: { dialCode: "", number: "", countryCode: "" },
      password: "********",
    },
  });

  const { watch, reset, setValue, register, formState } = form;
  const phoneValue = watch("phone");

  const phoneString = phoneValue
    ? `${phoneValue.dialCode}${phoneValue.number}`
    : "";

  useEffect(() => {
    if (user) {
      // ✅ Parse flat phone string into structured object
      const parsePhone = (phone: any) => {
        if (!phone) return { dialCode: "", number: "", countryCode: "" };
        // already an object
        if (typeof phone === "object") return phone;
        // flat string like "201501092044" — extract dial code
        const phoneStr = String(phone);
        // common dial codes to detect (add more as needed)
        const dialCodes = [
          "+2",
          "+1",
          "+44",
          "+91",
          "+49",
          "+33",
          "+971",
          "+966",
        ];
        // also handle without + prefix e.g "20..." for Egypt (+20)
        const withPlus = phoneStr.startsWith("+") ? phoneStr : `+${phoneStr}`;
        const matched = dialCodes.find((code) => withPlus.startsWith(code));
        if (matched) {
          return {
            dialCode: matched,
            number: withPlus.slice(matched.length),
            countryCode: "",
          };
        }
        // fallback: put everything in number
        return { dialCode: "", number: phoneStr, countryCode: "" };
      };

      reset({
        username: user.username || "",
        email: user.email || "",
        phone: parsePhone(user.phone),
        password: "********",
      });
    }
  }, [user, reset]);

  const setFieldLoading = (field: string, loading: boolean) => {
    setLoadingFields((prev) =>
      loading ? [...prev, field] : prev.filter((f) => f !== field),
    );
  };

  const handleSave = async (field: keyof typProfileData) => {
    const isValid = await form.trigger(field);
    if (!isValid) return;

    const value = form.getValues(field);
    setFieldLoading(field, true);

    try {
      const payload: Record<string, any> = {};

      if (field === "phone") {
        const phone: typPhone = form.getValues("phone");
        payload.phone = {
          dialCode: phone.dialCode,
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
      if (!res.ok) throw new Error(data?.error || t("updatingError"));

      // ✅ Email — revert field + show persistent alert
      if (field === "email") {
        setValue("email", user?.email || ""); // revert to old email visually
        setEditingFields((prev) => prev.filter((f) => f !== "email"));
        toast(
          (toastInstance) => (
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-sm flex items-center gap-1">
                <MdOutlineMarkEmailRead />
                {t("emailChangeTitle")}
              </p>
              <p className="text-sm text-gray-600">
                {t("emailChangeDesc", { email: String(value) })}
              </p>
              <button
                className="mt-1 text-xs text-blue-600 underline self-start"
                onClick={() => toast.dismiss(toastInstance.id)}
              >
                {t("gotIt")}
              </button>
            </div>
          ),
          {
            duration: 10000, // 10 seconds
            icon: null,
            style: {
              maxWidth: "360px",
              padding: "12px",
            },
          },
        );
        return;
      }

      toast.success(t("updatingSuccess", { field }));
      setEditingFields((prev) => prev.filter((f) => f !== field));
      setValue(field, value);
    } catch (err: any) {
      toast.error(err.message || t("updatingError"));
    } finally {
      setFieldLoading(field, false);
    }
  };

  const handleCancel = (field: keyof typProfileData) => {
    if (user) {
      if (field === "phone") {
        const parsePhone = (phone: any) => {
          if (!phone) return { dialCode: "", number: "", countryCode: "" };
          if (typeof phone === "object") return phone;
          const withPlus = String(phone).startsWith("+")
            ? String(phone)
            : `+${String(phone)}`;
          const dialCodes = [
            "+2",
            "+1",
            "+44",
            "+91",
            "+49",
            "+33",
            "+971",
            "+966",
          ];
          const matched = dialCodes.find((code) => withPlus.startsWith(code));
          return matched
            ? {
                dialCode: matched,
                number: withPlus.slice(matched.length),
                countryCode: "",
              }
            : { dialCode: "", number: String(phone), countryCode: "" };
        };
        setValue("phone", parsePhone(user.phone));
      } else if (field === "username") {
        setValue("username", user.username || "");
      } else {
        setValue(field, (user as any)[field] || "");
      }
    }
    setEditingFields((prev) => prev.filter((f) => f !== field));
  };

  const handlePassword = () => router.push("/profile/change-password");

  const toggleEditing = (field: keyof typProfileData) => {
    setEditingFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field],
    );
  };

  if (userLoading) return <LoadingSpinner />;

  const fieldLabels: Record<string, string> = {
    username: t("username"),
    email: t("email"),
    phone: t("phone"),
    password: t("password"),
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-background p-6 rounded-2xl shadow-sm"
    >
      {Object.entries(form.getValues()).map(([key]) => {
        const isEditing = editingFields.includes(key);
        const isFieldLoading = loadingFields.includes(key); // ✅ per-field loading

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
                    {isFieldLoading ? (
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
                  ? phoneString
                  : String(form.getValues(key as keyof typProfileData) ?? "")
              }
            />
          </div>
        );
      })}
    </form>
  );
}
