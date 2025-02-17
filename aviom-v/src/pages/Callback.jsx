import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const Callback = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  useEffect(() => {
    const getToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          const response = await axios.post("http://localhost:5000/api/exchange-token", { code });

          localStorage.setItem("token", response.data.access_token);
          localStorage.setItem("refresh_token", response.data.refresh_token);
          setToken(response.data.access_token);
          console.log("✅ Connexion réussie avec Keycloak !");
          navigate("/");
        } catch (error) {
          console.error("❌ Erreur de connexion:", error);
          navigate("/login");
        }
      }
    };

    getToken();
  }, [navigate, setToken]);

  return <p>Connexion en cours...</p>;
};

export default Callback;
