import React, { useEffect, useState } from "react";
import axios from "axios";
import PaymentOptions from "./PaymentOptions";
import ConfigurationModal from "./ConfigurationModal";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import api from "../axiosConfig";
import "./serveur.css";
const Serveur = () => {
  // State management
  // ---------------------------------------------
  // 1) Set showForm = true to immediately display the configuration page.
  // 2) Set selectedConfig = "classique" if you want the "Classique Configuration" displayed by default.
  const [showForm, setShowForm] = useState(true);
  const [serverName, setServerName] = useState("");
  const [selectedConfig, setSelectedConfig] = useState("classique");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const [packs, setPacks] = useState([]);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configType, setConfigType] = useState("");
  const [flexPricing, setFlexPricing] = useState({});
  const [flexConfig, setFlexConfig] = useState({ cpu: 4, ram: 4, hdd: 100, ip: 1 });

  const [userPacks, setUserPacks] = useState({ eco: 0, duo: 0, trio: 0, flex: 0 });
  const [hasPack, setHasPack] = useState(false);

  const navigate = useNavigate();

  // Fetch packs data on component mount
  // ---------------------------------------------
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/packs")
      .then((response) => {
        setPacks(response.data);
      })
      .catch((error) => {
        console.error("❌ Erreur lors de la récupération des packs :", error);
      });
  }, []);

  // Fetch user profile data
  // ---------------------------------------------
  useEffect(() => {
    api
      .get("/api/machine")
      .then((response) => {
        const { eco, duo, trio, flex } = response.data;
        console.log("Response from /api/machine:", response.data);
        setUserPacks({ eco, duo, trio, flex });
        setHasPack(eco === 1 || duo === 1 || trio === 1 || flex === 1);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  }, []);

  // Event handlers
  // ---------------------------------------------
  const handleCreateClick = () => setShowForm(true);
  const handleBackClick = () => setShowForm(false);
  const handleNameChange = (event) => setServerName(event.target.value);
  const handleConfigSelect = (config) => setSelectedConfig(config);

  const handleButtonClick = (packId) => {
    const selectedPack = packs.find((pack) => pack.id === packId);
    if (selectedPack) {
      setSelectedOffer({
        name: selectedPack.nom,
        cpu: `${selectedPack.cpu} vCores`,
        ram: `${selectedPack.ram} Go`,
        ssd: `${selectedPack.hdd} Go`,
        price: selectedPack.tarif,
        color: "#0275d8",
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
    console.log("Configuration details:", configDetails);
    setSelectedOffer({
      ...selectedOffer,
      name: configType.toUpperCase(),
      cpu: `${configDetails.cpu} vCores`,
      ram: `${configDetails.ram} Go`,
      ssd: `${configDetails.ssd} Go`,
      price: calculatePrice(configDetails), // Implement this function as needed
      color: getColorForConfig(configType), // Implement this function as needed
    });
    setShowConfigModal(false);
  };

  // Fetch Flex pricing
  // ---------------------------------------------
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/Flex")
      .then((response) => {
        const pricingData = {};
        response.data.forEach((item) => {
          pricingData[item.nom] = item.prix;
        });
        setFlexPricing(pricingData);
      })
      .catch((error) => {
        console.error("❌ Erreur lors de la récupération des tarifs Flex :", error);
      });
  }, []);

  // Update price whenever flexConfig changes
  // ---------------------------------------------
  useEffect(() => {
    updatePrice();
  }, [flexConfig]);

  const handleFlexChange = (e, type) => {
    let newValue = e.target.value.trim() === "" ? 0 : parseInt(e.target.value);
    setFlexConfig((prev) => ({ ...prev, [type]: newValue }));
  };

  const updatePrice = () => {
    if (Object.keys(flexPricing).length === 0) return;

    const cpuPrice = flexPricing["CPU"] || 5;
    const ramPrice = flexPricing["RAM"] || 5;
    const hddPrice = flexPricing["HDD"] || 5;
    const ipPrice = flexPricing["Adress IP"] || 5;

    const total =
      (flexConfig.cpu || 0) * cpuPrice +
      (flexConfig.ram || 0) * ramPrice +
      ((flexConfig.hdd || 0) / 100) * hddPrice +
      (flexConfig.ip || 0) * ipPrice;

    const flexPriceElement = document.getElementById("flex-price");
    const flexRecElement = document.getElementById("flex-recommendation");
    if (flexPriceElement) {
      flexPriceElement.textContent = `${total.toFixed(2)}€/mois`;
    }
    if (flexRecElement) {
      flexRecElement.innerHTML = recommendPack();
    }
  };

  // Helper functions
  // ---------------------------------------------
  const recommendPack = () => {
    if (packs.length === 0 || Object.keys(flexPricing).length === 0) return null;

    const flexTotalPrice =
      (flexConfig.cpu || 0) * (flexPricing["CPU"] || 5) +
      (flexConfig.ram || 0) * (flexPricing["RAM"] || 5) +
      ((flexConfig.hdd || 0) / 100) * (flexPricing["HDD"] || 5) +
      (flexConfig.ip || 0) * (flexPricing["Adress IP"] || 5);

    let eligiblePacks = [];
    let atLeastOnePackValid = false;

    for (const pack of packs) {
      const packTotalPrice = pack.tarif;
      if (flexTotalPrice < packTotalPrice * 0.8) continue;
      atLeastOnePackValid = true;

      const ramOK = pack.ram >= flexConfig.ram * 0.8;
      const cpuOK = pack.cpu >= flexConfig.cpu * 0.8;
      const hddOK = pack.hdd >= flexConfig.hdd * 0.8;
      const ipOK = pack.Adresse_IP >= flexConfig.ip * 0.8;

      if (ramOK && cpuOK && hddOK && ipOK) {
        eligiblePacks.push({ pack, packTotalPrice });
      }
    }

    if (!atLeastOnePackValid || eligiblePacks.length === 0) return null;

    const bestPack = eligiblePacks.reduce((prev, current) =>
      current.packTotalPrice < prev.packTotalPrice ? current : prev
    );

    return `
      <div>
        💡 Nous vous recommandons le pack <strong>${bestPack.pack.nom}</strong> (${bestPack.packTotalPrice.toFixed(
          2
        )}€/mois).
        <br>
      </div>
    `;
  };

  const getColorForConfig = (type) => {
    switch (type) {
      case "eco":
        return "#28a745";
      case "duo":
        return "#007bff";
      case "trio":
        return "#fd7e14";
      case "pro":
        return "#6f42c1";
      default:
        return "#0275d8";
    }
  };

  const handleSubmitBillingForm = (e) => {
    e.preventDefault();
    console.log("Form Submitted");
  };

  // Renders
  // ---------------------------------------------
  // We don't render a "server table" anymore; 
  // we only show the configuration form or the billing form.

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
          <input
            type="text"
            name="apartment"
            placeholder="Appartement, bureau, etc. (optionnel)"
          />
          <label>Ville *</label>
          <input type="text" name="city" required />
          <label>Code postal *</label>
          <input type="text" name="postalCode" required />
          <h3>Informations complémentaires</h3>
          <label>Notes de la commande (facultatif)</label>
          <textarea name="notes"></textarea>
          <PaymentOptions />
          <div className="form-buttons">
            <button type="submit" className="confirm-button">
              Confirmer
            </button>
            <button
              type="button"
              className="back-button"
              onClick={() => setShowRegisterForm(false)}
            >
              Retour
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // This is the main configuration form you want to see immediately on navigation
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
        {/* Classique */}
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
              <button className="create-btn eco" onClick={() => handleCreateButtonClick("eco")}>
                Créer
              </button>
              <button className="create-btn duo" onClick={() => handleCreateButtonClick("duo")}>
                Créer
              </button>
              <button className="create-btn trio" onClick={() => handleCreateButtonClick("trio")}>
                Créer
              </button>
              <button className="create-btn pro" onClick={() => handleCreateButtonClick("pro")}>
                Créer
              </button>
            </div>
          </div>
        )}

        {/* Ajout des VM */}
        {selectedConfig === "ajout-vm" && (
          <div className="config-details">
            <h5>Flex - Configuration</h5>
            <table className="config-table">
              <thead>
                <tr>
                  <th>Critère</th>
                  <th>Valeur</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>CPU</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max="192"
                      value={flexConfig.cpu}
                      step="1"
                      onChange={(e) => handleFlexChange(e, "cpu")}
                    />
                    <span>vCores</span>
                  </td>
                </tr>
                <tr>
                  <td>RAM</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max="3000"
                      value={flexConfig.ram}
                      step="1"
                      onChange={(e) => handleFlexChange(e, "ram")}
                    />
                    <span>Go</span>
                  </td>
                </tr>
                <tr>
                  <td>HDD</td>
                  <td>
                    <input
                      type="number"
                      min="100"
                      max="47000"
                      value={flexConfig.hdd}
                      step="100"
                      onChange={(e) => handleFlexChange(e, "hdd")}
                    />
                    <span>Go</span>
                  </td>
                </tr>
                <tr>
                  <td>Adresse IP</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max="128"
                      value={flexConfig.ip}
                      step="1"
                      onChange={(e) => handleFlexChange(e, "ip")}
                    />
                    <span>Adresse(s) IP</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex-price-container">
              <h4>
                Prix Total : <span id="flex-price">0€/mois</span>
              </h4>
              <button className="order-button" onClick={handleCreateButtonClick}>
                Commander
              </button>
            </div>
            <div id="flex-recommendation"></div>
          </div>
        )}

        {/* Flex */}
        {selectedConfig === "flex" && (
          <div className="config-details">
            <h5>Flex - Configuration</h5>
            <table className="config-table">
              <thead>
                <tr>
                  <th>Critère</th>
                  <th>Valeur</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>CPU</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max="192"
                      value={flexConfig.cpu}
                      step="1"
                      onChange={(e) => handleFlexChange(e, "cpu")}
                    />
                    <span>vCores</span>
                  </td>
                </tr>
                <tr>
                  <td>RAM</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max="3000"
                      value={flexConfig.ram}
                      step="1"
                      onChange={(e) => handleFlexChange(e, "ram")}
                    />
                    <span>Go</span>
                  </td>
                </tr>
                <tr>
                  <td>HDD</td>
                  <td>
                    <input
                      type="number"
                      min="100"
                      max="47000"
                      value={flexConfig.hdd}
                      step="100"
                      onChange={(e) => handleFlexChange(e, "hdd")}
                    />
                    <span>Go</span>
                  </td>
                </tr>
                <tr>
                  <td>Adresse IP</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max="128"
                      value={flexConfig.ip}
                      step="1"
                      onChange={(e) => handleFlexChange(e, "ip")}
                    />
                    <span>Adresse(s) IP</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex-price-container">
              <h4>
                Prix Total : <span id="flex-price">0€/mois</span>
              </h4>
              <button className="order-button" onClick={handleCreateButtonClick}>
                Commander
              </button>
            </div>
            <div id="flex-recommendation"></div>
          </div>
        )}
      </div>

      {/* If an offer is selected for "classique" */}
      {selectedConfig === "classique" && selectedOffer && (
        <div className="offer-summary">
          <div className="summary-header">
            <h5>Résumé</h5>
          </div>
          <div className="summary-content">
            <p>
              <strong>Nom :</strong> {selectedOffer.name}
            </p>
            <p>
              <strong>Tarif :</strong> {selectedOffer.price}
            </p>
            <p>
              <strong>Configuration :</strong>
            </p>
            <ul>
              <li>
                <strong>CPU :</strong> {selectedOffer.cpu}
              </li>
              <li>
                <strong>RAM :</strong> {selectedOffer.ram}
              </li>
              <li>
                <strong>SSD :</strong> {selectedOffer.ssd}
              </li>
            </ul>
            <button className="submit-button" onClick={() => setShowRegisterForm(true)}>
              Valider
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ---------------------------------------------
  // FINAL RETURN
  // ---------------------------------------------
  return (
    <div className="serveur-container">
      <header className="serveur-header">
        <div className="actions">
          <Button
            variant="primary"
            onClick={() => {
              navigate("/services");
              handleCreateClick();
            }}
          >
            Packs
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/machine")}
            disabled={!hasPack}
          >
            Gerer vos machines
          </Button>
        </div>
      </header>

      {showRegisterForm
        ? renderBillingForm()
        :
          showForm
          ? renderConfigurationForm()
          : null}

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
