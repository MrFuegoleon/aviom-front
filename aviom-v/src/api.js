import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// 📌 Intercepteur pour ajouter le token automatiquement à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 📌 Fonction pour récupérer les clients
export const fetchClients = async () => {
  const response = await api.get("/clients");
  return response.data;
};

// 📌 Fonction de login
export const login = async (username, password) => {
  const response = await api.post("/api/login", { username, password });
  localStorage.setItem("token", response.data.access_token);
  return response.data;
};

// 📌 Fonction de logout
export const logout = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  await api.post("/api/logout", { refresh_token: refreshToken });
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
};
