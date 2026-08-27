import Cookies from "js-cookie";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function fetchAPI(endpoint, options = {}) {
  const { method = "GET", body, token, headers = {} } = options;

  const authToken = token || (typeof window !== "undefined" ? Cookies.get("lms_token") : null);

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (authToken) {
    defaultHeaders["Authorization"] = `Bearer ${authToken}`;
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

    // 1. Handle HTTP 204 No Content or empty response on DELETE / PUT
    if (res.status === 204) {
      return { success: true };
    }

    // 2. Read as text first to safely check for empty body
    const text = await res.text();
    let data = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    } else {
      data = { success: res.ok };
    }

    if (!res.ok) {
      throw new Error(data?.error?.message || data?.message || "API request failed");
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