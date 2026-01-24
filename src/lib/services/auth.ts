import { UserAdapter } from "@/adapters/UserAdapter";
import { typUser } from "@/content/types";
import { notFound } from "next/navigation";
interface LoginCredentials {
  identifier: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user: any;
  error?: string;
}

interface SignupCredentials {
  email: string;
  password: string;
  username: string;
}

interface SignupResponse {
  success: boolean;
  user?: any;
  message?: string;
  emailConfirmationPending?: boolean;
  error?: string;
}

const userAdapter = UserAdapter.getInstance();

export async function fetchMe(): Promise<typUser | null> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) return null;

  const data = await res.json();
  
  if (!data) {
    notFound();
  }
  return userAdapter.adapt(data.user);
}

export async function loginApi(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const text = await response.text();
  const result = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(result.error || "Failed to login");
  }

  return result;
}

export async function signupApi(credentials: SignupCredentials): Promise<SignupResponse> {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to create user");
  }

  return result;
}

export async function logout(){
  const response = await fetch("/api/auth/logout", { method: "POST" });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to create user");
  }

  return result;
}

