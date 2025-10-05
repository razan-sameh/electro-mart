"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IoLockClosedOutline,
  IoMailOutline,
} from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";
import InputField from "../../../../../components/reusable/InputField";
import { Link } from "@/i18n/navigation";
import { loginSchema, typLoginData } from "../schemas";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const form = useForm<typLoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: typLoginData) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: data.email, // <-- match the API route
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Failed to login");

      // redirect after login
      router.push(redirect);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-8">
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
        <Link href={""} className="text-primary text-sm underline">
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
