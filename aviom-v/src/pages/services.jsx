import React, { useEffect, useState } from "react";
import axios from 'axios';
import PaymentOptions from "./PaymentOptions";
import  "./serveur.css";

import ConfigurationModal from './ConfigurationModal';

const Serveur = () => {
  // State management
  const [showForm, setShowForm] = useState(false);
  const [serverName, setServerName] = useState("");
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [packs, setPacks] = useState([]);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configType, setConfigType] = useState("");
  const [flexPricing, setFlexPricing] = useState({});

  // Fetch packs data on component mount
  useEffect(() => {
    axios.get("http://localhost:5000/api/packs")
      .then(response => {
        setPacks(response.data);
      })
      .catch(error => {
        console.error("❌ Erreur lors de la récupération des packs :", error);
      });
  }, []);

  // Event handlers
  const handleCreateClick = () => setShowForm(true);
  const handleBackClick = () => setShowForm(false);
  const handleNameChange = (event) => setServerName(event.target.value);
  const handleConfigSelect = (config) => setSelectedConfig(config);

  const handleButtonClick = (packId) => {
    const selectedPack = packs.find(pack => pack.id === packId);
    if (selectedPack) {
      setSelectedOffer({
        name: selectedPack.nom,
        cpu: `${selectedPack.cpu} vCores`,
        ram: `${selectedPack.ram} Go`,
        ssd: `${selectedPack.hdd} Go`,
        price: selectedPack.tarif,
        color: "#0275d8"
      });
    }
  };

  const handleCreateButtonClick = (configType) => {
    setConfigType(configType);
    setShowConfigModal(true);
  };

  const handleConfigModalClose = () => {
    setShowConfigModal(false);
  };

  const handleConfigModalSubmit = (configDetails) => {
    // Here you can use the configDetails to update your selectedOffer or other state
    console.log("Configuration details:", configDetails);
    
    // Update selectedOffer with the new configuration details
    setSelectedOffer({
      ...selectedOffer,
      name: configType.toUpperCase(),
      cpu: `${configDetails.cpu} vCores`,
      ram: `${configDetails.ram} Go`,
      ssd: `${configDetails.ssd} Go`,
      price: calculatePrice(configDetails), // You would need to implement this function
      color: getColorForConfig(configType) // You would need to implement this function
    });
    
    setShowConfigModal(false);
  };

  
  useEffect(() => {
    axios.get("http://localhost:5000/api/Flex")
      .then(response => {
        const pricingData = {};
        response.data.forEach(item => {
          pricingData[item.nom] = item.prix;  // Stocker les prix par type de ressource
        });
        setFlexPricing(pricingData);
      })
      .catch(error => {
        console.error("❌ Erreur lors de la récupération des tarifs Flex :", error);
      });
  }, []);
  const [flexConfig, setFlexConfig] = useState({ cpu: 4, ram: 4, hdd: 100, ip: 1 });


  const handleFlexChange = (e, type) => {
    let newValue = e.target.value.trim() === "" ? 0 : parseInt(e.target.value); // Convertir vide en 0
    setFlexConfig(prev => ({ ...prev, [type]: newValue }));
  };
  
  useEffect(() => {
    updatePrice();
  }, [flexConfig]); // Appelle `updatePrice()` à chaque fois que `flexConfig` change
    
  const updatePrice = () => {
    if (Object.keys(flexPricing).length === 0) return; // Vérifier si les prix sont chargés
  
    const cpuPrice = flexPricing["CPU"] || 5;
    const ramPrice = flexPricing["RAM"] || 5;
    const hddPrice = flexPricing["HDD"] || 5;
    const ipPrice = flexPricing["Adress IP"] || 5;
  
    const total = 
      ((flexConfig.cpu || 0) * cpuPrice) + 
      ((flexConfig.ram || 0) * ramPrice) + 
      ((flexConfig.hdd || 0) / 100 * hddPrice) + 
      ((flexConfig.ip || 0) * ipPrice);
    
    document.getElementById("flex-price").textContent = `${total.toFixed(2)}€/mois`;
    // 🔹 Mise à jour de la recommandation juste après le calcul du prix
    document.getElementById("flex-recommendation").innerHTML = recommendPack();
  };
  const recommendPack = () => {
    if (packs.length === 0 || Object.keys(flexPricing).length === 0) return null; // 🔹 Ne retourne rien si les données ne sont pas prêtes

    // 🔹 Calcul du prix total basé sur Flex
    const flexTotalPrice =
        ((flexConfig.cpu || 0) * (flexPricing["CPU"] || 5)) +
        ((flexConfig.ram || 0) * (flexPricing["RAM"] || 5)) +
        ((flexConfig.hdd || 0) / 100 * (flexPricing["HDD"] || 5)) +
        ((flexConfig.ip || 0) * (flexPricing["Adress IP"] || 5));

    let eligiblePacks = []; // 🔹 Liste des packs qui passent la Condition 2

    let atLeastOnePackValid = false; // 🔹 Vérifie si au moins un pack passe la Condition 1

    for (const pack of packs) {
        const packTotalPrice = pack.tarif;  // ✅ Utiliser directement le prix du pack en BDD

        // 🔹 Condition 1 : Vérifier que Prix Flex ≥ 80% du Prix du Pack
        if (flexTotalPrice < packTotalPrice * 0.8) continue; // ❌ Si aucun pack ne passe ce test, on ne recommande rien
        
        atLeastOnePackValid = true; // ✅ Un pack passe la condition de prix, donc on continue avec la Condition 2

        // 🔹 Condition 2 : Vérifier que chaque ressource du pack est ≥ 80% des ressources demandées
        const ramOK = (pack.ram >= flexConfig.ram * 0.8);
        const cpuOK = (pack.cpu >= flexConfig.cpu * 0.8);
        const hddOK = (pack.hdd >= flexConfig.hdd * 0.8);
        const ipOK = (pack.Adresse_IP >= flexConfig.ip * 0.8);

        if (ramOK && cpuOK && hddOK && ipOK) {
            eligiblePacks.push({ pack, packTotalPrice });
        }
    }

    // 🔹 Si aucun pack ne valide la Condition 1, on retourne `null` (aucun message d'erreur affiché)
    if (!atLeastOnePackValid) return null;

    // 🔹 Si aucun pack ne valide la Condition 2, on ne retourne rien non plus
    if (eligiblePacks.length === 0) return null;

    // 🔹 Sélectionner le pack le MOINS CHER parmi les éligibles
    const bestPack = eligiblePacks.reduce((prev, current) => 
        current.packTotalPrice < prev.packTotalPrice ? current : prev
    );

    const savings = flexTotalPrice - bestPack.packTotalPrice;

    return `
        <div style="padding:10px; background-color:#e6f2ff; border-radius:5px;">
            💡 Nous vous recommandons le pack <strong>${bestPack.pack.nom}</strong> (${bestPack.packTotalPrice.toFixed(2)}€/mois).
            <br> 
        </div>
    `;
};




  
      
  // Helper function to get color based on config type
  const getColorForConfig = (type) => {
    switch(type) {
      case "eco": return "#28a745";
      case "duo": return "#007bff";
      case "trio": return "#fd7e14";
      case "pro": return "#6f42c1";
      default: return "#0275d8";
    }
  };


  const handleSubmitBillingForm = (e) => {
    e.preventDefault();
    console.log("Form Submitted");
    // Add form submission logic here
  };

// Render components based on state
const renderPacksTable = () => (
  <table className="packs-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nom</th>
        <th>CPU (coeurs)</th>
        <th>RAM (Go)</th>
        <th>HDD (To)</th>
        <th>Adresse IP</th>
        <th>Prix (€)</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {packs.map((pack) => (
        <tr key={pack.id}>
          <td>{pack.id}</td>
          <td>{pack.nom}</td>
          <td>{pack.cpu}</td>
          <td>{pack.ram}</td>
          <td>{pack.hdd}</td>
          <td>{pack.Adresse_IP}</td>
          <td>{pack.tarif}</td>
          <td>
            <button className="select-button" onClick={() => handleCreateButtonClick(pack.id)}>
              Sélectionner
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);


  const renderBillingForm = () => (
    <div className="register-container">
      <div className="register-box">
        <h2>Détails de facturation</h2>
        <form onSubmit={handleSubmitBillingForm}>
          <div className="form-row">
            <div className="form-column">
              <label>Prénom *</label>
              <input type="text" name="firstName" required />
            </div>
            <div className="form-column">
              <label>Nom *</label>
              <input type="text" name="lastName" required />
            </div>
          </div>
          
          <label>Nom de l'entreprise (facultatif)</label>
          <input type="text" name="company" />
          
          <div className="form-row">
            <div className="form-column">
              <label>Adresse e-mail *</label>
              <input type="email" name="email" required />
            </div>
            <div className="form-column">
              <label>Téléphone *</label>
              <input type="tel" name="phone" required />
            </div>
          </div>
          
          <label>Pays *</label>
          <select name="country">
            <option value="France">France</option>
            <option value="Belgique">Belgique</option>
            <option value="Suisse">Suisse</option>
          </select>
          
          <label>Adresse *</label>
          <input type="text" name="address" required />
          <input type="text" name="apartment" placeholder="Appartement, bureau, etc. (optionnel)" />
          
          <label>Ville *</label>
          <input type="text" name="city" required />
          
          <label>Code postal *</label>
          <input type="text" name="postalCode" required />
          
          <h3>Informations complémentaires</h3>
          <label>Notes de la commande (facultatif)</label>
          <textarea name="notes"></textarea>
          
          <PaymentOptions />
          
          <div className="form-buttons">
            <button type="submit" className="confirm-button">Confirmer</button>
            <button type="button" className="back-button" onClick={() => setShowRegisterForm(false)}>Retour</button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderConfigurationForm = () => (
    <div className="form-container">
      <h3>Créer un serveur Cloud</h3>
      <label className="server-name-label">
        Nom :
        <input
          type="text"
          placeholder="Nom du serveur"
          value={serverName}
          onChange={handleNameChange}
        />
      </label>
      
      <h4>Configurations recommandées</h4>
      <div className="configurations">
        <div className="config-option">
          <button 
            className={`config-button ${selectedConfig === "classique" ? "active" : ""}`}
            onClick={() => handleConfigSelect("classique")}
          >
            Classique
          </button>
        </div>

        <div className="config-option">
          <button 
            className={`config-button ${selectedConfig === "ajout-vm" ? "active" : ""}`}
            onClick={() => handleConfigSelect("ajout-vm")}
          >
            Ajout des VM
          </button>
        </div>

        <div className="config-option">
          <button 
            className={`config-button ${selectedConfig === "flex" ? "active" : ""}`}
            onClick={() => handleConfigSelect("flex")}
          >
            Flex
          </button>
        </div>
      </div>

      <div className="services-container">
        {selectedConfig === "classique" && (
          <div className="config-details">
            <h5>Classique Configuration</h5>
            <table className="config-table">
              <thead>
                <tr>
                  <th>Critère</th>
                  <th className="eco">ECO</th>
                  <th className="duo">DUO</th>
                  <th className="trio">TRIO</th>
                  <th className="pro">PRO</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Nb. de VM</td>
                  <td className="eco">1</td>
                  <td className="duo">2</td>
                  <td className="trio">3</td>
                  <td className="pro">Personnalisable</td>
                </tr>
                <tr>
                  <td>Nb. de coeurs total</td>
                  <td className="eco">1 à 2 vCores</td>
                  <td className="duo">2 à 5 vCores</td>
                  <td className="trio">3 à 7 vCores</td>
                  <td className="pro">Personnalisable</td>
                </tr>
                <tr>
                  <td>Mémoire RAM totale</td>
                  <td className="eco">1 à 4 Go</td>
                  <td className="duo">2 à 9 Go</td>
                  <td className="trio">4 à 11 Go</td>
                  <td className="pro">Personnalisable</td>
                </tr>
                <tr>
                  <td>Espace disque total</td>
                  <td className="eco">10 Go</td>
                  <td className="duo">20 à 70 Go</td>
                  <td className="trio">50 à 90 Go</td>
                  <td className="pro">Personnalisable</td>
                </tr>
                <tr>
                  <td>Nb. d'adresses IP publiques</td>
                  <td className="eco">1</td>
                  <td className="duo">2</td>
                  <td className="trio">2</td>
                  <td className="pro">Personnalisable</td>
                </tr>
                <tr>
                  <td>Pare-feu mutualisé</td>
                  <td className="eco">✔</td>
                  <td className="duo">✔</td>
                  <td className="trio">✔</td>
                  <td className="pro">✔</td>
                </tr>
                <tr>
                  <td>Infogérance incluse</td>
                  <td className="eco">✔</td>
                  <td className="duo">✔</td>
                  <td className="trio">✔</td>
                  <td className="pro">✔</td>
                </tr>
                <tr>
                  <td>VLAN dédié</td>
                  <td className="eco">❌</td>
                  <td className="duo">✔</td>
                  <td className="trio">✔</td>
                  <td className="pro">✔</td>
                </tr>
                <tr>
                  <td>Accès VPN</td>
                  <td className="eco">❌</td>
                  <td className="duo">✔</td>
                  <td className="trio">✔</td>
                  <td className="pro">✔</td>
                </tr>
              </tbody>
            </table>
            <div className="create-buttons-container">
              <button className="create-btn eco" onClick={() => handleCreateButtonClick("eco")}>Créer</button>
              <button className="create-btn duo" onClick={() => handleCreateButtonClick("duo")}>Créer</button>
              <button className="create-btn trio" onClick={() => handleCreateButtonClick("trio")}>Créer</button>
              <button className="create-btn pro" onClick={() => handleCreateButtonClick("pro")}>Créer</button>
            </div>
          </div>
        )}

        {selectedConfig === "ajout-vm" && renderPacksTable()}
        {selectedConfig === "flex" && (
          <div className="config-details">
            <h5>Flex - Configuration</h5>
            <table className="config-table" 
              style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                margin: '20px 0', 
                borderRadius: '10px', 
                overflow: 'hidden', 
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' 
              }}
            >
              <thead>
                <tr style={{ background: 'linear-gradient(to right, #007bff, #34bede)', color: '#fff' }}>
                <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', color: 'black' 
                }}>Critère</th>

              <th style={{ padding: '15px',textAlign: 'center', fontWeight: 'bold', color: 'black'
              }}>Valeur</th>

                </tr>
              </thead>
              <tbody>
                {/* CPU */}
                <tr style={{ backgroundColor: '#f9f9f9', transition: 'background 0.3s' }}>
                  <td style={{ padding: '15px', border: '1px solid #ddd', fontWeight: 'bold' }}>CPU</td>
                  <td style={{ padding: '15px', border: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="number"
                      min="1"
                      max="192"
                      value={flexConfig.cpu}
                      step="1"
                      onChange={(e) => handleFlexChange(e, "cpu")}
                      style={{
                        width: '80px',
                        textAlign: 'center',
                        marginRight: '10px',
                        padding: '8px',
                        border: '2px solid #007bff',
                        borderRadius: '5px',
                        fontSize: '16px',
                        transition: '0.3s',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.border = '2px solid #34bede'}
                      onBlur={(e) => e.target.style.border = '2px solid #007bff'}
                    />
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>vCores</span>
                  </td>
                </tr>

                {/* RAM */}
                <tr style={{ backgroundColor: '#ffffff', transition: 'background 0.3s' }}>
                  <td style={{ padding: '15px', border: '1px solid #ddd', fontWeight: 'bold' }}>RAM</td>
                  <td style={{ padding: '15px', border: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="number"
                      min="1"
                      max="3000"
                      value={flexConfig.ram}
                      step="1"
                      onChange={(e) => handleFlexChange(e, "ram")}
                      style={{
                        width: '80px',
                        textAlign: 'center',
                        marginRight: '10px',
                        padding: '8px',
                        border: '2px solid #007bff',
                        borderRadius: '5px',
                        fontSize: '16px',
                        transition: '0.3s',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.border = '2px solid #34bede'}
                      onBlur={(e) => e.target.style.border = '2px solid #007bff'}
                    />
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Go</span>
                  </td>
                </tr>

                {/* HDD */}
                <tr style={{ backgroundColor: '#f9f9f9', transition: 'background 0.3s' }}>
                  <td style={{ padding: '15px', border: '1px solid #ddd', fontWeight: 'bold' }}>HDD</td>
                  <td style={{ padding: '15px', border: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="number"
                      min="100"
                      max="47000"
                      value={flexConfig.hdd}
                      step="100"
                      onChange={(e) => handleFlexChange(e, "hdd")}
                      style={{
                        width: '80px',
                        textAlign: 'center',
                        marginRight: '10px',
                        padding: '8px',
                        border: '2px solid #007bff',
                        borderRadius: '5px',
                        fontSize: '16px',
                        transition: '0.3s',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.border = '2px solid #34bede'}
                      onBlur={(e) => e.target.style.border = '2px solid #007bff'}
                    />
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Go</span>
                  </td>
                </tr>

                {/* Adresse IP */}
                <tr style={{ backgroundColor: '#ffffff', transition: 'background 0.3s' }}>
                  <td style={{ padding: '15px', border: '1px solid #ddd', fontWeight: 'bold' }}>Adresse IP</td>
                  <td style={{ padding: '15px', border: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="number"
                      min="1"
                      max="128"
                      value={flexConfig.ip}
                      step="1"
                      onChange={(e) => handleFlexChange(e, "ip")}
                      style={{
                        width: '80px',
                        textAlign: 'center',
                        marginRight: '10px',
                        padding: '8px',
                        border: '2px solid #007bff',
                        borderRadius: '5px',
                        fontSize: '16px',
                        transition: '0.3s',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.border = '2px solid #34bede'}
                      onBlur={(e) => e.target.style.border = '2px solid #007bff'}
                    />
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Adresse(s) IP</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex-price-container" style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ fontWeight: "bold" }}>Prix Total : <span id="flex-price">0€/mois</span></h4>
              <button className="order-button" style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }} onClick={handleCreateButtonClick}>
                Commander
              </button>
            </div>
            <div id="flex-recommendation" style={{ marginTop: "10px", fontWeight: "bold", color: "#007bff" }}>
            </div>
          </div>
        )}
      </div>

      {selectedConfig === "classique" && selectedOffer && (
        <div className="offer-summary">
          <div className="summary-header" style={{ background: selectedOffer.color }}>
            <h5>Résumé</h5>
          </div>
          <div className="summary-content">
            <p><strong>Nom :</strong> {selectedOffer.name}</p>
            <p><strong>Tarif :</strong> {selectedOffer.price}</p>
            <p><strong>Configuration :</strong></p>
            <ul>
              <li><strong>CPU :</strong> {selectedOffer.cpu}</li>
              <li><strong>RAM :</strong> {selectedOffer.ram}</li>
              <li><strong>SSD :</strong> {selectedOffer.ssd}</li>
            </ul>
            <button className="submit-button" onClick={() => setShowRegisterForm(true)}>
              Valider
            </button>
          </div>
        </div>
      )}
      
      <button className="back-button" onClick={handleBackClick}>
        Retour
      </button>
    </div>
  );

  const renderServerTable = () => (
    <>
      <table className="serveur-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>État</th>
            <th>Sauvegarde</th>
            <th>IP</th>
            <th>Type</th>
            <th>SE</th>
            <th>Avertissements</th>
            <th>Centre de calcul</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="radio" /> Cloud Server 0</td>
            <td><span className="status-green"></span></td>
            <td><span className="backup-icon"></span></td>
            <td>XXX.XXX.XXX.XXX</td>
            <td>S</td>
            <td><span className="os-icon"></span> Ubuntu 22.04</td>
            <td>--</td>
            <td><span className="data-center-icon"></span></td>
          </tr>
        </tbody>
      </table>
      
    </>
  );

  return (
    <div className="serveur-container">
      <header className="serveur-header">
        
        <div className="actions">
          <button className="create-button" onClick={handleCreateClick}>
            Actions
          </button>
          <button className="action-button">
            Créer
          </button>
          <button className="action-button">
            Réseau
          </button>
          <button className="filter-button">
            Filtre ▾
          </button>
        </div>
      </header>

      {showRegisterForm ? renderBillingForm() : 
       showForm ? renderConfigurationForm() : 
       renderServerTable()}

      {showConfigModal && (
        <ConfigurationModal 
          configType={configType}
          onClose={handleConfigModalClose}
          onSubmit={handleConfigModalSubmit}
        />
      )}
    </div>
  );
};

export default Serveur;