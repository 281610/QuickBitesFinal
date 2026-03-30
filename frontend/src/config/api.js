const PROD_API_BASE = "https://quickbitesfinal-2.onrender.com";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "https://quickbitesfinal-2.onrender.com" : PROD_API_BASE);

export function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}
