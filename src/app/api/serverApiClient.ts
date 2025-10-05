export async function serverApiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";
  const url = `${baseUrl}${endpoint}`;

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    console.error("API Error:", error);
    throw new Error(error.error?.message || error.message || "API request failed");
  }

  return res.json();
}
