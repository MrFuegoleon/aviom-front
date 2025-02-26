import React, { useEffect, useState } from "react";
import axios from 'axios';
import MachineDetails from "../components/MachineData/machine";
import PaymentOptions from "./PaymentOptions";
import  "./serveur.css";

import ConfigurationModal from './ConfigurationModal';

const Serveur = () => {
  // State management
  const [showForm, setShowForm] = useState(false);
  const [serverName, setServerName] = useState("");
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [machines, setMachines] = useState([]);
  const [message, setMessage] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [packs, setPacks] = useState([]);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configType, setConfigType] = useState("");

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

  // Helper function to calculate price based on configuration
  const calculatePrice = (config) => {
    // This is a simple example, adjust according to your pricing model
    const cpuPrice = config.cpu * 10;
    const ramPrice = config.ram * 5;
    const ssdPrice = config.ssd * 0.5;
    return `${cpuPrice + ramPrice + ssdPrice}€/mois`;
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

  const handleActionClick = () => {
    axios.post('/api/create-vm')
      .then(response => {
        setMessage('Machine créée avec succès');
        const newMachine = response.data.data;
        setMachines(prevMachines => [...prevMachines, newMachine]);
      })
      .catch(error => {
        setMessage('Erreur lors de la création de la machine');
        console.error('Erreur:', error.response ? error.response.data : error.message);
      });
  };

  const handleSubmitBillingForm = (e) => {
    e.preventDefault();
    console.log("Form Submitted");
    // Add form submission logic here
  };

  // Render components based on state
  const renderPacksTable = () => (
    <table className="packs-table">
      <tbody>
        {packs.map((pack) => (
          <tr key={pack.id}>
            <td>{pack.id}</td>
            <td>{pack.nom}</td>
            <td>{pack.cpu}</td>
            <td>{pack.ram}</td>
            <td>{pack.hdd}</td>
            <td>{pack.tarif}</td>
            <td>
              <button className="select-button" onClick={() => handleButtonClick(pack.id)}>
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

        {selectedConfig === "ajout-vm" && (
          <div className="config-details">
            <h5>Ajout des Machines Virtuelles</h5>
            <table className="config-table">
              <thead>
                <tr>
                  <th>Critère</th>
                  <th>VM STARTER</th>
                  <th>VM BOOSTER</th>
                  <th>VM POWER</th>
                  <th>VM MONSTER</th>
                  <th>VM PRO</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Nombre de coeurs</td>
                  <td>1 x 2,4 GHz</td>
                  <td>1 x 2,4 GHz</td>
                  <td>2 x 2,4 GHz</td>
                  <td>4 x 2,4 GHz</td>
                  <td>1 à 4 x 2,4 GHz</td>
                </tr>
                <tr>
                  <td>Mémoire RAM</td>
                  <td>1 Go</td>
                  <td>2 Go</td>
                  <td>4 Go</td>
                  <td>8 Go</td>
                  <td>1 à 8 Go</td>
                </tr>
                <tr>
                  <td>Espace disque</td>
                  <td>10 Go</td>
                  <td>10 Go</td>
                  <td>10 Go</td>
                  <td>10 Go</td>
                  <td>10 Go</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {selectedConfig === "flex" && (
          <div className="config-details">
            <h5>Flex - Configuration</h5>
            <table className="config-table" style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px', backgroundColor: '#f4f4f4', textAlign: 'left', fontWeight: 'bold' }}>Critère</th>
                  <th style={{ padding: '10px', backgroundColor: '#f4f4f4', textAlign: 'left', fontWeight: 'bold' }}>Valeur</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>CPU</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <input
                      type="range"
                      min="1"
                      max="24"
                      defaultValue="4"
                      step="1"
                      onInput={(e) => e.target.nextElementSibling.textContent = `${e.target.value} vCores`}
                      style={{ width: '100%', marginBottom: '10px' }}
                    />
                    <span>4 vCores</span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>RAM</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <input
                      type="range"
                      min="0.5"
                      max="128"
                      defaultValue="4"
                      step="0.5"
                      onInput={(e) => e.target.nextElementSibling.textContent = `${e.target.value} Go`}
                      style={{ width: '100%', marginBottom: '10px' }}
                    />
                    <span>4 Go</span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>SSD</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      defaultValue="100"
                      onInput={(e) => e.target.nextElementSibling.textContent = `${e.target.value} Go`}
                      style={{ width: '100%', marginBottom: '10px' }}
                    />
                    <span>100 Go</span>
                  </td>
                </tr>
              </tbody>
            </table>
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
      
      {message && <p className="message">{message}</p>}
      
      <div className="machines-list">
        {machines.length === 0 ? (
          <p>Aucune machine créée pour l'instant.</p>
        ) : (
          machines.map((machine, index) => {
            if (!machine) return null;
            return <MachineDetails key={machine.id || index} machine={machine} />;
          })
        )}
      </div>
    </>
  );

  return (
    <div className="serveur-container">
      <header className="serveur-header">
        {renderPacksTable()}
        <div className="actions">
          <button className="create-button" onClick={handleCreateClick}>
            Actions
          </button>
          <button className="action-button" onClick={handleActionClick}>
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