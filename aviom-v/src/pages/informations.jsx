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
    <div className="max-w-5xl mx-auto p-10 bg-white shadow-xl rounded-lg border border-gray-300">
      <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Informations Personnelles</h1>
      <p className="text-gray-600 text-center mb-6">
        Cet espace permet de consulter et modifier vos informations personnelles, mot de passe et préférences.
      </p>
      <div className="button-container flex justify-center space-x-6 mb-6">
        <button 
          className={`tab-button ${!isEditing ? 'active' : ''}`} 
          onClick={() => setIsEditing(false)}
        >
          Mes informations
        </button>
        <button 
          className={`tab-button ${isEditing ? 'active' : ''}`} 
          onClick={() => setIsEditing(true)}
        >
          Modifier mes informations
        </button>
      </div>
      <table className="w-full text-left border-collapse border border-gray-300 rounded-lg overflow-hidden">
        <tbody>
          {Object.entries(userInfo).map(([key, value]) => (
            <tr key={key} className="border-b border-gray-200 hover:bg-gray-100 transition">
              <td className="p-4 font-semibold bg-gray-100 uppercase text-gray-700 text-lg">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
              <td className="p-4">
                {isEditing ? (
                  <input
                    type="text"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                ) : (
                  <span className="text-gray-800 font-medium text-lg">{value}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isEditing && (
        <div className="mt-6 text-center">
          <button 
            className="px-8 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-700 transition shadow-md"
            onClick={handleSave}
          >
            Enregistrer
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
