import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("booki_booki_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("booki_booki_token");
      window.dispatchEvent(new Event("booki:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export async function fetchBooks({ page = 1, limit = 12, search = "", genreId = null } = {}) {
  let endpoint = "/books";
  const params = { page, limit };

  if (search.trim()) {
    endpoint = "/books/search";
    params.q = search.trim();
  } else if (genreId) {
    endpoint = `/books/genre/${genreId}`;
  }

  const response = await api.get(endpoint, { params });
  return response.data;
}

export async function fetchGenres() {
  const response = await api.get("/genres");
  return response.data.data;
}

export async function fetchBook(id) {
  const response = await api.get(`/books/${id}`);
  return response.data.data;
}

export default api;

export async function fetchCart() { const response = await api.get("/cart"); return response.data.data; }
export async function fetchPaymentProfile() { const response = await api.get("/payment-profile"); return response.data.data; }
export async function savePaymentProfile(profile) { const response = await api.put("/payment-profile", profile); return response.data.data; }
export async function placeOrder() { const response = await api.post("/checkout"); return response.data.data; }