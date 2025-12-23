"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IoLockClosedOutline,
  IoMailOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { useSearchParams } from "next/navigation";
import InputField from "../../../../../components/reusable/InputField";
import { typSignupData, SignupSchema } from "../components/schemas";
import { Link, useRouter } from "@/i18n/navigation";
import { useSignup } from "@/lib/hooks/useAuth";

export default function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const form = useForm<typSignupData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });
  const signupMutation = useSignup();

  const onSubmit = async (data: typSignupData) => {
    setIsLoading(true);
    setError("");
    try {
      const result = await signupMutation.mutateAsync({
        email: data.email,
        password: data.password,
        username: `${data.firstName} ${data.lastName}`,
      });

      if (result.success && result.user) {
        // Redirect to the intended page
        router.push(redirect);
      }
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
          placeholder="First Name"
          icon={IoPersonOutline}
          error={form.formState.errors.firstName}
          register={form.register}
          name="firstName"
        />
        <InputField
          placeholder="Last Name"
          icon={IoPersonOutline}
          error={form.formState.errors.lastName}
          register={form.register}
          name="lastName"
        />
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
        <InputField
          placeholder="Confirm Password"
          icon={IoLockClosedOutline}
          error={form.formState.errors.confirmPassword}
          register={form.register}
          name="confirmPassword"
          type="password"
        />

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Sign Up"}
        </button>
      </form>
      <div className="mt-6 text-sm text-gray-500">
        <p className="mb-2">Have you already created an account?</p>
        <Link
          href={`/login?redirect=${redirect}`}
          className="inline-block w-full text-center border border-primary text-primary py-2 rounded-md mt-2"
        >
          Login
        </Link>
      </div>
    </>
  );
}
