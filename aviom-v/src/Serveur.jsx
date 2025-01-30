import React from "react";
import "./Serveur.css";

const Serveur = () => {
  return (
    <div className="serveur-container">
      <header className="serveur-header">
        <h2>Serveurs</h2>
        <div className="actions">
        <button className="create-button">
            Créer
        </button>
          <button className="action-button">Actions</button>
          <button className="action-button">Réseau</button>
          <button className="filter-button">Filtre ▾</button>
        </div>
      </header>

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
    </div>
  );
};

export default Serveur;
