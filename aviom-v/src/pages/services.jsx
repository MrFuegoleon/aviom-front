import React, { useState } from "react";
import "./Serveur.css";
import MachineDetails from "../components/MachineData/machine";
import axios from 'axios';
import PaymentOptions from "./PaymentOptions"; // Vérifie le chemin

const Serveur = () => {
  const [showForm, setShowForm] = useState(false);
  const [serverName, setServerName] = useState("");
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [machines, setMachines] = useState([]);
  const [message, setMessage] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleCreateClick = () => {
    setShowForm(true);
  };

  const handleBackClick = () => {
    setShowForm(false);
  };

  const handleNameChange = (event) => {
    setServerName(event.target.value);
  };

  const handleConfigSelect = (config) => {
    setSelectedConfig(config);
  };

  const handleButtonClick = (offerType) => {
    const offers = {
      eco: { name: "Serveur Cloud ECO", cpu: "1-2 vCores", ram: "1-4 Go", ssd: "10 Go", price: "9€/mois HT", color: "#5cb85c" },
      duo: { name: "Serveur Cloud DUO", cpu: "2-5 vCores", ram: "2-9 Go", ssd: "20-70 Go", price: "19€/mois HT", color: "#0275d8" },
      trio: { name: "Serveur Cloud TRIO", cpu: "3-7 vCores", ram: "4-11 Go", ssd: "50-90 Go", price: "29€/mois HT", color: "#d9534f" },
      pro: { name: "Serveur Cloud PRO", cpu: "Personnalisable", ram: "Personnalisable", ssd: "Personnalisable", price: "Sur Devis", color: "#292b2c" }
    };
  
    setSelectedOffer(offers[offerType]);
  };

  const handleActionClick = () => {
    axios.post('/api/create-vm')
      .then(response => {
        setMessage('Machine créée avec succès');
        // On suppose que la réponse renvoie un objet du type { data: { server: { ... } } }
        const newMachine = response.data.data;
        // Ajouter la nouvelle machine à la liste existante
        setMachines(prevMachines => [...prevMachines, newMachine]);
        console.log(newMachine)
      })
      .catch(error => {
        setMessage('Erreur lors de la création de la machine');
        console.error('Erreur:', error.response ? error.response.data : error.message);
      });
  };

  return (
    <div className="serveur-container">
      <header className="serveur-header">
        <h2>Serveurs</h2>
        <div className="actions">
          <button className="create-button" onClick={handleCreateClick}>
            Actions
          </button>
          <button className="action-button" onClick={handleActionClick}>Créer</button>
          <button className="action-button">Réseau</button>
          <button className="filter-button">Filtre ▾</button>
        </div>
      </header>

      {showRegisterForm ? (
          // FORMULAIRE DE FACTURATION À LA PLACE DES BOUTONS & TABLEAUX
          <div className="register-container">
            <div className="register-box">
              <h2>Détails de facturation</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                console.log("Form Submitted");
              }}>
                <div className="row">
                  <div className="column">
                    <label>Prénom *</label>
                    <input type="text" name="firstName" required />
                  </div>
                  <div className="column">
                    <label>Nom *</label>
                    <input type="text" name="lastName" required />
                  </div>
                </div>
                <label>Nom de l’entreprise (facultatif)</label>
                <input type="text" name="company" />
                <div className="row">
                  <div className="column">
                    <label>Adresse e-mail *</label>
                    <input type="email" name="email" required />
                  </div>
                  <div className="column">
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
                <button type="submit">Confirmer</button>
                <button type="button" onClick={() => setShowRegisterForm(false)}>Retour</button>
              </form>
            </div>
          </div>
        ) :showForm ? (
        <div className="form-container">
          <h3>Créer un serveur Cloud</h3>
          <label>
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
            <div className="config-classique">
              <button onClick={() => handleConfigSelect("classique")}>Classique</button>
            </div>

            <div className="config-vm">
              <button onClick={() => handleConfigSelect("ajout-vm")}>Ajout des VM</button>
            </div>

            <div className="config-flex">
              <button onClick={() => handleConfigSelect("flex")}>Flex</button>
            </div>
          </div>

          <div className="services-container">
            {/* Table for the selected configuration */}
            {selectedConfig === "classique" && (
              <div className="config-details">
                <h5>Classique Configuration</h5>
                <table className="config-table">
                  <thead>
                    <tr>
                      <th>Critère</th><th className="eco">ECO</th><th className="duo">DUO</th><th className="trio">TRIO</th><th className="pro">PRO</th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr>
                <td>Nb. de VM</td><td className="eco">1</td><td className="duo">2</td><td className="trio">3</td><td className="pro">Personnalisable</td>
              </tr>
              <tr>
                <td>Nb. de coeurs total</td><td className="eco">1 à 2 vCores</td><td className="duo">2 à 5 vCores</td><td className="trio">3 à 7 vCores</td><td className="pro">Personnalisable</td>
              </tr>
              <tr>
                <td>Mémoire RAM totale</td><td className="eco">1 à 4 Go</td><td className="duo">2 à 9 Go</td><td className="trio">4 à 11 Go</td><td className="pro">Personnalisable</td>
              </tr>
              <tr>
                <td>Espace disque total</td><td className="eco">10 Go</td><td className="duo">20 à 70 Go</td><td className="trio">50 à 90 Go</td><td className="pro">Personnalisable</td>
              </tr>
              <tr>
                <td>Nb. d'adresses IP publiques</td><td className="eco">1</td><td className="duo">2</td><td className="trio">2</td><td className="pro">Personnalisable</td>
              </tr>
              <tr>
                <td>Pare-feu mutualisé</td><td className="eco">✔</td><td className="duo">✔</td><td className="trio">✔</td><td className="pro">✔</td>
              </tr>
              <tr>
                <td>Infogérance incluse</td><td className="eco">✔</td><td className="duo">✔</td><td className="trio">✔</td><td className="pro">✔</td>
              </tr>
              <tr>
                <td>VLAN dédié</td><td className="eco">❌</td><td className="duo">✔</td><td className="trio">✔</td><td className="pro">✔</td>
              </tr>
              <tr>
                <td>Accès VPN</td><td className="eco">❌</td><td className="duo">✔</td><td className="trio">✔</td><td className="pro">✔</td>
              </tr>
              <div className="create-buttons-container">
                <button className="create-btn eco" onClick={() => handleButtonClick("eco")}>Créer</button>
                <button className="create-btn duo" onClick={() => handleButtonClick("duo")}>Créer</button>
                <button className="create-btn trio" onClick={() => handleButtonClick("trio")}>Créer</button>
                <button className="create-btn pro" onClick={() => handleButtonClick("pro")}>Créer</button>
              </div>

                  </tbody>
                </table>
              </div>
            )}

            {/* Ajout des VM Configuration */}
            {selectedConfig === "ajout-vm" && (
              <div className="config-details">
                <h5>Ajout des Machines Virtuelles</h5>
                <table className="config-table">
                  <thead>
                    <tr>
                      <th>Critère</th><th>VM STARTER</th><th>VM BOOSTER</th><th>VM POWER</th><th>VM MONSTER</th><th>VM PRO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Nombre de coeurs</td><td>1 x 2,4 GHz</td><td>1 x 2,4 GHz</td><td>2 x 2,4 GHz</td><td>4 x 2,4 GHz</td><td>1 à 4 x 2,4 GHz</td></tr>
                    <tr><td>Mémoire RAM</td><td>1 Go</td><td>2 Go</td><td>4 Go</td><td>8 Go</td><td>1 à 8 Go</td></tr>
                    <tr><td>Espace disque</td><td>10 Go</td><td>10 Go</td><td>10 Go</td><td>10 Go</td><td>10 Go</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Flex Configuration */}
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
                    <tr><td>CPU</td><td><input type="range" min="1" max="24" defaultValue="4" /> 4 vCores</td></tr>
                    <tr><td>RAM</td><td><input type="range" min="0.5" max="128" defaultValue="4" /> 4 Go</td></tr>
                    <tr><td>SSD</td><td><input type="range" min="10" max="500" defaultValue="100" /> 100 Go</td></tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selectedConfig === "classique" && selectedOffer && (
            <div className="config-details">
            
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
                <button className="submit-button" onClick={() => setShowRegisterForm(true)}>Valider</button>
              </div>
              </div>
            
          )}
          {/* Bouton de retour */}
          <button className="back-button" onClick={handleBackClick}>Retour</button>
        </div>
      ) : (
        // Afficher le tableau des serveurs seulement si le formulaire n'est pas visible
        <table className="serveur-table">
          <thead>
            <tr>
              <th>Nom</th><th>État</th><th>Sauvegarde</th><th>IP</th><th>Type</th><th>SE</th><th>Avertissements</th><th>Centre de calcul</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="radio" /> Cloud Server 0</td><td><span className="status-green"></span></td><td><span className="backup-icon"></span></td><td>XXX.XXX.XXX.XXX</td><td>S</td><td><span className="os-icon"></span> Ubuntu 22.04</td><td>--</td><td><span className="data-center-icon"></span></td>
            </tr>
          </tbody>
        </table>
      )}
      {message && <p>{message}</p>}
      <div className="machines-list">
        {machines.length === 0 ? (
          <p>Aucune machine créée pour l'instant.</p>
        ) : (
          machines.map((machine, index) => {
            // Si la machine est indéfinie, on renvoie null
            if (!machine) return null;
            return <MachineDetails key={machine.id || index} machine={machine} />;
          })
        )}
      </div>

    </div>
  );
};

export default Serveur;
