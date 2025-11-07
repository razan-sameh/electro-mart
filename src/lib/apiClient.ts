// apiClient.ts
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";
export const STRAPI_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:1337";
// In apiClient.ts - let React Query handle ALL caching
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, string | number | boolean>,
  locale?: string
): Promise<T> {
  const url = new URL(`${API_URL}${endpoint}`);

  const queryParams = locale ? { ...params, locale } : params || {};

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    cache: "default",
    credentials: "include", // ✅ مهم جدًا
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "API request failed");
  }

  return res.json();
}
