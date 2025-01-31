import React from 'react';
import CloudDashboard from '../components/CloudDashboard/cloudDashboard';

const Dashboard = () => {
  // Données dynamiques pour le header
  const headerData = {
    title: "Tableau de Bord Aviom",
    description: "Explorez vos données en temps réel et prenez des décisions éclairées.",
  };

  // Exemple de logs en format Lorem Ipsum
  const logs = [
    "[2024-01-31 10:15:42] INFO - System initialized successfully.",
    "[2024-01-31 10:16:05] DEBUG - Connecting to database: host=lorem.db user=ipsum",
    "[2024-01-31 10:16:07] WARN - Slow response detected from API: /dolor/sit/amet",
    "[2024-01-31 10:16:12] ERROR - Database connection failed: Access denied for user 'ipsum'",
    "[2024-01-31 10:16:20] DEBUG - Connection successful, fetching data...",
    "[2024-01-31 10:16:30] CRITICAL - Unexpected server shutdown: quis nostrud exercitation ullamco laboris"
  ];

  // Services fictifs à afficher
  const services = [
    {
      name: "Gestion de Cloud",
      description: "Optimisez vos ressources cloud avec nos solutions évolutives et sécurisées, adaptées à tous vos besoins professionnels."
    },
    {
      name: "Analyse de Données",
      description: "Transformez vos données brutes en insights exploitables pour une meilleure prise de décision et performance."
    }
  ];

  return (
    <div className="grid-container">
      {/* Header section - dynamique et attirant */}
      <div className="header">
        <div className="header-content">
          <h1 className="header-title">{headerData.title}</h1>
          <p className="header-description">{headerData.description}</p>
        </div>
        <div className="header-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-line"></div>
        </div>
      </div>
      
      {/* Dashboard */}
      <CloudDashboard />

      {/* Section pour les logs et la publicité */}
      <div className="additional-section">
        {/* Composant pour afficher les logs */}
        <div className="logs-container">
          <h2 className="logs-title">Logs Système</h2>
          <div className="logs-content">
            {logs.map((log, index) => (
              <p key={index} className="log-entry">{log}</p>
            ))}
          </div>
        </div>

        {/* Composant pour afficher les services */}
        <div className="advertising-container">
          <h2 className="advertising-title">Nos Services</h2>
          <div className="advertising-content">
            <p>Découvrez nos services qui peuvent transformer votre entreprise :</p>
            {services.map((service, index) => (
              <div key={index} className="service-item">
                <h3 className="service-name">{service.name}</h3>
                <p className="service-description">{service.description}</p>
              </div>
            ))}
            <a href="/services" className="advertising-link">En savoir plus</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
