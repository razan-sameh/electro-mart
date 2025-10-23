export async function serverApiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";
  const url = `${baseUrl}${endpoint}`;
  console.log("API Request:", { url, method: options.method, body: options.body });

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const responseData = await res.json().catch(() => ({}));
  
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

  console.log("API Success:", responseData);
  return responseData;
}