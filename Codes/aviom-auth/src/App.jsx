import React, { useState } from "react";
import "./App.css";
import RegisterPage from "./register_page";

const AuthPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!identifier || !code) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    console.log("Authentification réussie", { identifier, code });
  };

  return (
    <div className="auth-container">
      {showRegister ? (
        <RegisterPage />
      ) : (
        <div className="auth-box">
          <h2>Connexion</h2>
          <form onSubmit={handleLogin}>
            <label>Identifiant :</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Votre identifiant"
            />
            <label>Code :</label>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Votre code"
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

export default AuthPage;
