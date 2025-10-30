"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoLockClosedOutline } from "react-icons/io5";
import { useSearchParams } from "next/navigation";
import InputField from "@/components/reusable/InputField";
import { resetPasswordSchema, typResetPasswordData } from "./schemas";
import { useRouter } from "@/i18n/navigation";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<typResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (data: typResetPasswordData) => {
    if (!code) {
      setError("Invalid reset link");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          password: data.password,
          passwordConfirmation: data.passwordConfirmation,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to reset password");
      }

      // Redirect to login page after successful reset
      router.push("/login?reset=success");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!code) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700 text-center">
            Invalid or missing reset code. Please request a new password reset link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-2">Reset Password</h2>
      <p className="text-gray-600 text-center mb-6">
        Enter your new password below.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          placeholder="New Password"
          icon={IoLockClosedOutline}
          error={form.formState.errors.password}
          register={form.register}
          name="password"
          type="password"
        />

        <InputField
          placeholder="Confirm Password"
          icon={IoLockClosedOutline}
          error={form.formState.errors.passwordConfirmation}
          register={form.register}
          name="passwordConfirmation"
          type="password"
        />

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}