// src/Login.jsx
import React, { useState } from "react";
import api from "../axiosConfig"; 
import { useNavigate } from "react-router-dom";
import './LoginForm.css'
import RegisterPage from "./RegisterForm";
function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false); // Ajout du state pour basculer vers l'inscription
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/auth/login", {
        username,
        password,
      });
      // Token's storage
      localStorage.setItem("token", response.data.token);
      console.log(response.data.token)
      // Redirect to dashboard
      navigate("/");
    } catch (err) {
      setError("Identifiants invalides");
    }
  };

  return (

    <div className="auth-container">
          {showRegister ? (
            <RegisterPage />
          ) : (
            <div className="auth-box">
              <h2>Connexion</h2>
              <form onSubmit={handleSubmit}>
                <label>Identifiant :</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Votre identifiant"
                />
                <label>Mot de passe :</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe "
                />
                {error && <p className="error">{error}</p>}
                <button type="submit">Se connecter</button>
              </form>
              <p className="register-link">
                Pas encore de compte ? <a href="#" onClick={() => setShowRegister(true)}>Créer un compte</a>
              </p>
            </div>
          )}
        </div>
      );
    };
export default LoginForm;
