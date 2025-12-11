"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoLockClosedOutline } from "react-icons/io5";
import InputField from "@/components/reusable/InputField";
import { resetPasswordSchema, typResetPasswordData } from "./schemas";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function ResetPasswordForm() {
  const t = useTranslations("ResetPasswordForm");

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<typResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (data: typResetPasswordData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          password: data.password,
          passwordConfirmation: data.passwordConfirmation,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t("resetError"));
      }

      router.push("/profile");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 min-h-[500px] flex flex-col justify-center">
      <h2 className="text-2xl font-bold text-center mb-2">{t("title")}</h2>
      <p className="text-gray-600 text-center mb-6">{t("description")}</p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          placeholder={t("currentPassword")}
          icon={IoLockClosedOutline}
          error={form.formState.errors.currentPassword}
          register={form.register}
          name="currentPassword"
          type="password"
        />

        <InputField
          placeholder={t("newPassword")}
          icon={IoLockClosedOutline}
          error={form.formState.errors.password}
          register={form.register}
          name="password"
          type="password"
        />

        <InputField
          placeholder={t("confirmPassword")}
          icon={IoLockClosedOutline}
          error={form.formState.errors.passwordConfirmation}
          register={form.register}
          name="passwordConfirmation"
          type="password"
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t("updating") : t("updatePassword")}
        </button>
      </form>
    </div>
  );
}
