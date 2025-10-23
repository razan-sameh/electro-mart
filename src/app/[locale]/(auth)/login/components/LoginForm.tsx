"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoLockClosedOutline, IoMailOutline } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";
import InputField from "../../../../../components/reusable/InputField";
import { Link } from "@/i18n/navigation";
import { loginSchema, typLoginData } from "./schemas";
import { FcGoogle } from "react-icons/fc";
import { useMergeGuestCartToUser } from "@/hooks/useMergeGuestCartToUser";
import { useCart } from "@/lib/hooks/useCart";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";
  const redirect = searchParams.get("redirect") || "/";
  const form = useForm<typLoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { merge } = useMergeGuestCartToUser();
  const { refetch } = useCart();

  const onSubmit = async (data: typLoginData) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: data.email,
          password: data.password,
        }),
      });

      const text = await response.text();
      const result = text ? JSON.parse(text) : {};

      if (!response.ok) throw new Error(result.error || "Failed to login");
      router.push(redirect);
      if (result.success && result.user) {
        await merge();
        await refetch();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const strapiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
    window.location.href = `${strapiUrl}/api/connect/google`;
  };

  return (
    <>
      {resetSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
          <p className="text-green-700 text-sm text-center">
            Password reset successful! Please login with your new password.
          </p>
        </div>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-4">
        <InputField
          placeholder="Email"
          icon={IoMailOutline}
          error={form.formState.errors.email}
          register={form.register}
          name="email"
          type="email"
        />
        <InputField
          placeholder="Password"
          icon={IoLockClosedOutline}
          error={form.formState.errors.password}
          register={form.register}
          name="password"
          type="password"
        />

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        <Link
          href="/forgot-password"
          className="text-primary text-sm underline"
        >
          Forget Password?
        </Link>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white py-2 mt-3 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Login"}
        </button>
      </form>
      {/* ---- OR separator ---- */}
      <div className="flex items-center justify-center my-4">
        <div className="w-full h-px bg-gray-300" />
        <span className="px-3 text-gray-500 text-sm">OR</span>
        <div className="w-full h-px bg-gray-300" />
      </div>

      {/* ---- Google login button ---- */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex items-center justify-center w-full border border-gray-300 rounded-md py-2 hover:bg-gray-50 transition"
      >
        <FcGoogle className="w-5 h-5 mr-2" />
        <span className="text-gray-700 text-sm font-medium">
          Login with Google account
        </span>
      </button>

      <div className="mt-6 text-sm text-gray-500 text-center">
        <Link
          href={`/register?redirect=${redirect}`}
          className=" hover:text-primary transition-colors py-2 mt-2  "
        >
          Create an account.
        </Link>
      </div>
    </>
  );
}
