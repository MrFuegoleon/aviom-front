import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  // 🔹 Log pour voir si le token est bien chargé
  console.log("🔍 [useAuth] Token actuel:", token);

  useEffect(() => {
    if (token) {
      axios
        .get(`${API_URL}/api/protected`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => {
          console.log("❌ [useAuth] Token invalide, suppression...");
          setUser(null);
          localStorage.removeItem("token");
          setToken("");
        });
    }
  }, [token]);

  const login = () => {
    const keycloakURL = `http://localhost:8080/auth/realms/Aviom/protocol/openid-connect/auth` +
      `?client_id=myclient` +
      `&redirect_uri=${encodeURIComponent(window.location.origin + "/callback")}` +
      `&response_type=code` +
      `&scope=openid`;
  
    console.log("🔄 Redirection vers Keycloak:", keycloakURL);
    window.location.href = keycloakURL;
  };
  
  

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/logout`, { refresh_token: localStorage.getItem("refresh_token") });
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      setToken("");
      setUser(null);
      console.log("✅ [useAuth] Déconnexion réussie !");
    } catch (error) {
      console.error("❌ [useAuth] Erreur de déconnexion:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error("❌ [useAuth] useAuth() appelé en dehors de AuthProvider !");
  }
  return context;
};
