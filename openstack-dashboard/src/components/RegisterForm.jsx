import React, { useState } from "react";
import "./register_page.css";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Ajouter l'intégration API pour enregistrement ici
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Inscription</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="column">
              <label>Prénom *</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="column">
              <label>Nom *</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>
          <label>Nom de l’entreprise (facultatif)</label>
          <input type="text" name="company" value={formData.company} onChange={handleChange} />
          <div className="row">
            <div className="column">
              <label>Adresse e-mail *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="column">
              <label>Téléphone *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
          </div>
          <label>Identifiant *</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          <label>Mot de passe *</label>
          <input type="text" name="password" value={formData.password} onChange={handleChange} required />
          <label>Ville *</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />
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