const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function fetchAPI(endpoint, options = {}) {
  const { method = "GET", body, token, headers = {} } = options;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers: defaultHeaders,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api${endpoint}`, config);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error?.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error(`Fetch API Error (${endpoint}):`, error);
    throw error;
  }
}

export function getStrapiMedia(url) {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("//")) {
    return url;
  }
  return `${STRAPI_URL}${url}`;
}