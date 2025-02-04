import React, { useState } from "react";
import "./register_page.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    country: "France",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    notes: "",
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
        <h2>Détails de facturation</h2>
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
          <label>Pays *</label>
          <select name="country" value={formData.country} onChange={handleChange}>
            <option value="France">France</option>
            <option value="Belgique">Belgique</option>
            <option value="Suisse">Suisse</option>
          </select>
          <label>Adresse *</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
          <input type="text" name="apartment" placeholder="Appartement, bureau, etc. (optionnel)" value={formData.apartment} onChange={handleChange} />
          <label>Ville *</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />
          <label>Code postal *</label>
          <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
          <h3>Informations complémentaires</h3>
          <label>Notes de la commande (facultatif)</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
          <button type="submit">Créer un compte</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
