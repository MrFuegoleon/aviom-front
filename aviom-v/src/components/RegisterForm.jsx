import React, { useState } from "react";
import "./register_page.css";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    city: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // send to backend API
      const response = await api.post("/api/auth/register", formData);
      setMessage(response.data.message || "Inscription réussie !");
      setError("");
      navigate("/");
    } catch (err) {
      console.error("Erreur lors de l'inscription :", err);
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
      setMessage("");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Inscription</h2>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="column">
              <label>Prénom *</label>
              <input 
                type="text" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="column">
              <label>Nom *</label>
              <input 
                type="text" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          <label>Nom de l’entreprise (facultatif)</label>
          <input 
            type="text" 
            name="company" 
            value={formData.company} 
            onChange={handleChange} 
          />
          <div className="row">
            <div className="column">
              <label>Adresse e-mail *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="column">
              <label>Téléphone *</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          <label>Identifiant *</label>
          <input 
            type="text" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            required 
          />
          <label>Mot de passe *</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
          <label>Ville *</label>
          <input 
            type="text" 
            name="city" 
            value={formData.city} 
            onChange={handleChange} 
            required 
          />
          <button type="submit">Créer un compte</button>
        </form>
        <p className="register-link">
          <a href="/login">Retour à la connexion</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
