// src/axiosConfig.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // URL de votre backend
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Supprimer le token expiré
      localStorage.removeItem("token");
      // Rediriger vers la page de connexion
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
