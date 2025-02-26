import React, { useState } from "react";
import "./information.css";

const UserInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    entite: "Entreprise",
    raisonSociale: "Wpmarmite",
    numeroSiret: "75188464400038",
    nom: "Bortolotti",
    prenom: "Alexandre",
    telephone: "+33645921198",
    email: "alex@wpmarmite.com",
    adresse: "15 rue emile zola",
    codePostal: "10000",
    ville: "Troyes",
    pays: "FRANCE"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="user-info-container">
      <div className="user-info-header">
        <h1>Informations Personnelles</h1>
        <p>
          Cet espace permet de consulter et modifier vos informations personnelles, 
          mot de passe et préférences.
        </p>
      </div>

      <div className="edit-toggle">
        <button 
          className={`edit-button ${isEditing ? 'editing' : ''}`}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Annuler les modifications' : 'Modifier mes informations'}
        </button>
      </div>

      <div className="info-card">
        <div className="info-grid">
          {Object.entries(userInfo).map(([key, value]) => (
            <div key={key} className="info-row">
              <label>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
              <div className="info-content">
                {isEditing ? (
                  <input
                    type="text"
                    name={key}
                    value={value}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{value}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="save-section">
            <button className="save-button" onClick={handleSave}>
              Enregistrer les modifications
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .user-info-container {
          max-width: 1000px;
          margin: 2rem auto;
          padding: 0 1rem;
        }

        .user-info-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .user-info-header h1 {
          font-size: 2.25rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.75rem;
        }

        .user-info-header p {
          color: #666;
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .tabs-container {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .tab {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          color: #666;
          background: #f5f5f5;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab:hover {
          background: #eee;
        }

        .tab.active {
          background: #1a1a1a;
          color: white;
        }

        .edit-toggle {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 1.5rem;
        }

        .edit-button {
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: 500;
          background: #f5f5f5;
          color: #1a1a1a;
          border: 1px solid #ddd;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .edit-button:hover {
          background: #eee;
        }

        .edit-button.editing {
          background: #fff0f0;
          color: #dc2626;
          border-color: #fecaca;
        }

        .info-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                      0 2px 4px -1px rgba(0, 0, 0, 0.06);
          padding: 2rem;
        }

        .info-grid {
          display: grid;
          gap: 1.5rem;
        }

        .info-row {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 2rem;
          align-items: center;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #eee;
        }

        .info-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .info-row label {
          font-weight: 600;
          color: #666;
          text-transform: capitalize;
        }

        .info-content {
          font-size: 1.1rem;
          color: #1a1a1a;
        }

        .info-content input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .info-content input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .save-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #eee;
          text-align: center;
        }

        .save-button {
          padding: 1rem 2.5rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .save-button:hover {
          background: #1d4ed8;
        }

        @media (max-width: 768px) {
          .tabs-container {
            flex-direction: column;
          }

          .info-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .info-row label {
            margin-bottom: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default UserInfo;