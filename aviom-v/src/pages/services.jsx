import React, { useState } from "react";
import "./Serveur.css";

const Serveur = () => {
  const [showForm, setShowForm] = useState(false);
  const [serverName, setServerName] = useState("");
  const [selectedConfig, setSelectedConfig] = useState(null);

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

  return (
    <div className="serveur-container">
      <header className="serveur-header">
        <h2>Serveurs</h2>
        <div className="actions">
          <button className="create-button" onClick={handleCreateClick}>
            Créer
          </button>
          <button className="action-button">Actions</button>
          <button className="action-button">Réseau</button>
          <button className="filter-button">Filtre ▾</button>
        </div>
      </header>

      {showForm ? (
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
              <div className="create-buttons-container">
              <div className="create-btn-wrapper">
                <button className="create-btn eco">Créer</button>
              </div>
              <div className="create-btn-wrapper">
                <button className="create-btn duo">Créer</button>
              </div>
              <div className="create-btn-wrapper">
                <button className="create-btn trio">Créer</button>
              </div>
              <div className="create-btn-wrapper">
                <button className="create-btn pro">Créer</button>
              </div>
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
                      <th>Critère</th>
                      <th>VM STARTER</th>
                      <th>VM BOOSTER</th>
                      <th>VM POWER</th>
                      <th>VM MONSTER</th>
                      <th>VM PRO</th>
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
                <div><strong>Prix :</strong> 28,80 € / Mois</div>
              </div>
            )}
          </div>

          {/* Résumé */}
          <div className="summary">
            <h5>Résumé</h5>
            <p>Nom : {serverName || "Nom du serveur non spécifié"}</p>
            <p>Configuration : Serveur Cloud L - 24€/mois</p>
            <p>Ressources : 2 vCore, 4 Go RAM, 80 Go SSD</p>
            <button className="submit-button">Valider</button>
          </div>

          {/* Bouton de retour */}
          <button className="back-button" onClick={handleBackClick}>Retour</button>
        </div>
      ) : (
        // Afficher le tableau des serveurs seulement si le formulaire n'est pas visible
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
      )}
    </div>
  );
};

export default Serveur;
