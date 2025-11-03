"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoLockClosedOutline } from "react-icons/io5";
import InputField from "@/components/reusable/InputField";
import { resetPasswordSchema, typResetPasswordData } from "./schemas";
import { useRouter } from "@/i18n/navigation";

export default function ResetPasswordForm() {
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
        throw new Error(result.error || "Failed to reset password");
      }

      router.push("/profile"); // ✅ redirect after success
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-2">Change Password</h2>
      <p className="text-gray-600 text-center mb-6">
        Enter your current and new password below.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* 🔐 Current password */}
        <InputField
          placeholder="Current Password"
          icon={IoLockClosedOutline}
          error={form.formState.errors.currentPassword}
          register={form.register}
          name="currentPassword"
          type="password"
        />

        {/* 🆕 New password */}
        <InputField
          placeholder="New Password"
          icon={IoLockClosedOutline}
          error={form.formState.errors.password}
          register={form.register}
          name="password"
          type="password"
        />

        {/* 🔁 Confirm new password */}
        <InputField
          placeholder="Confirm New Password"
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
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
