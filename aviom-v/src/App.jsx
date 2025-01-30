import React, { useState } from "react";
import './index.css';
import Sidebar from "./components/Sidebar/Sidebar";
import Serveur from "./Serveur";

const App = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <div className="app-container">
      <Sidebar setPage={setCurrentPage} />

      <div className="main-content">
        {currentPage === "dashboard" && (
          <>
            <h2>Bienvenue dans votre espace de gestion</h2>
            <p>Gérez vos services et abonnements en toute simplicité.</p>

            {/* Commandes */}
            <section className="orders">
              <div className="order-card">
                <h3>Commander l'Offre Unique Tout en Un</h3>
                <p>L'offre Star d'Hébergement Web, avec un nom de domaine offert !</p>
                <button className="info-btn">+ Info</button>
              </div>
              <div className="order-card">
                <h3>Commander l'Offre Scale'UP</h3>
                <p>Nous accompagnons votre succès avec une offre boostée.</p>
                <button className="info-btn">+ Info</button>
              </div>
              <div className="order-card">
                <h3>Commander un Serveur Infogéré</h3>
                <p>Une offre serveur dédié baremetal pour répondre aux besoins titanesques.</p>
                <button className="info-btn">+ Info</button>
              </div>
            </section>

            {/* Statistiques */}
            <section className="stats">
              <div className="stat-box">01 HÉBERGEMENT</div>
              <div className="stat-box">01 DOMAINE</div>
            </section>

            {/* Liste des services */}
            <section className="services-list">
              <h3>Liste des services</h3>
              <div className="service-item">
                <p className="service-name">qecu7804</p>
                <p className="service-domain">votresitewp.com</p>
                <p className="renewal">Renouveler (21/05/2025)</p>
              </div>
              <p className="other-services">Vous avez <strong>2 autres services</strong> disponibles.</p>
            </section>
          </>
        )}

        {currentPage === "serveurs" && <Serveur />}
      </div>
    </div>
  );
};

export default App;
