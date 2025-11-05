export async function serverApiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, string | number | boolean>,
  locale?: string
): Promise<T> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

  // Construct full URL
  const url = new URL(`${baseUrl}${endpoint}`);

  // Merge locale + params
  const queryParams = locale ? { ...params, locale } : params || {};

  // Append query params
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });
console.log('url',url.toString());

  // Make the request
  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  // Parse response
  const responseData = await res.json().catch(() => ({}));

  // Handle errors
  if (!res.ok) {
    console.error("API Error Response:", {
      status: res.status,
      statusText: res.statusText,
      data: responseData,
    });

    throw new Error(
      responseData?.error?.message ||
        responseData?.message ||
        responseData?.errors?.[0]?.message ||
        `API request failed: ${res.status} ${res.statusText}`
    );
  }

  return responseData;
}