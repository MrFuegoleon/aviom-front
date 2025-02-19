import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaCloud, 
  FaChartLine, 
  FaServer, 
  FaDatabase, 
  FaBell 
} from "react-icons/fa";
import CloudDashboard from "../components/CloudDashboard/cloudDashboard";
import "./dashboard.css";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  // Données dynamiques pour le header
  const headerData = {
    title: "Tableau de Bord Aviom",
    description: "Explorez vos données en temps réel et prenez des décisions éclairées.",
  };
  const { logout } = useAuth();

  // Logs système
  const [logs, setLogs] = useState([
    "[2024-01-31 10:15:42] INFO - System initialized successfully.",
    "[2024-01-31 10:16:05] DEBUG - Connecting to database: host=lorem.db user=ipsum",
    "[2024-01-31 10:16:07] WARN - Slow response detected from API: /dolor/sit/amet",
    "[2024-01-31 10:16:12] ERROR - Database connection failed: Access denied for user 'ipsum'",
    "[2024-01-31 10:16:20] DEBUG - Connection successful, fetching data...",
    "[2024-01-31 10:16:30] CRITICAL - Unexpected server shutdown: quis nostrud exercitation ullamco laboris"
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = `[${new Date().toISOString()}] INFO - New log entry: ${Math.random().toString(36).substring(7)}`;
      setLogs((prev) => [newLog, ...prev].slice(0, 10));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Services fictifs
  const services = [
    {
      icon: <FaCloud size={32} />,
      name: "Gestion de Cloud",
      description: "Optimisez vos ressources cloud avec des solutions évolutives et sécurisées.",
      link: "/cloud"
    },
    {
      icon: <FaChartLine size={32} />,
      name: "Analyse de Données",
      description: "Transformez vos données en insights exploitables pour une meilleure prise de décision.",
      link: "/analytics"
    },
    {
      icon: <FaServer size={32} />,
      name: "Machines Virtuelles",
      description: "Gérez et surveillez vos VM avec des outils puissants et intuitifs.",
      link: "/vm"
    },
    {
      icon: <FaDatabase size={32} />,
      name: "Bases de Données",
      description: "Assurez la performance et la sécurité de vos bases de données.",
      link: "/database"
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Header animé */}
      <motion.header
        className="dashboard-header"
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="header-text">
          <h1>{headerData.title}</h1>
          <p>{headerData.description}</p>
        </div>
        <div className="header-icons">
        <button className="logout-button" onClick={logout}>🔒 Se Déconnecter</button>
          <NotificationBell />
        </div>
      </motion.header>

      {/* Contenu principal avec effet cascade */}
      <motion.div 
        className="dashboard-main"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Statistiques et CloudDashboard */}
        <motion.div className="dashboard-stats" variants={itemVariants}>
          <StatCard />
        </motion.div>

        {/* Services */}
        <motion.div className="dashboard-services" variants={itemVariants}>
          <h2>Nos Services</h2>
          <div className="services-grid">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Section logs */}
      <motion.section
        className="dashboard-logs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <h2>Logs Système</h2>
        <div className="logs-container">
          {logs.map((log, index) => (
            <LogEntry key={index} log={log} />
          ))}
        </div>
      </motion.section>
    </div>
  );
};

// Variantes pour l'effet cascade
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.25 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

// Cloche de notification avec effet "pulse"
const NotificationBell = () => {
  const [notifications, setNotifications] = useState(3);

  return (
    <motion.div 
      className="notification-bell"
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <FaBell />
      {notifications > 0 && (
        <div className="notification-count">{notifications}</div>
      )}
    </motion.div>
  );
};

// Carte stat card avec animation légère
const StatCard = () => {
  return (
    <motion.div 
      className="stat-card"
      whileHover={{ y: -8, boxShadow: "0 12px 20px rgba(0,0,0,0.15)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h2>Activités</h2>
      <div className="stat-content">
        <CloudDashboard />
      </div>
    </motion.div>
  );
};

// Carte de service avec effet tilt léger
const ServiceCard = ({ icon, name, description, link }) => (
  <motion.div 
    className="service-card"
    whileHover={{ rotate: 2, scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: "spring", stiffness: 250 }}
  >
    <div className="service-icon">{icon}</div>
    <h3>{name}</h3>
    <p>{description}</p>
  </motion.div>
);

// Entrée de log avec animation d'apparition
const LogEntry = ({ log }) => (
  <motion.div 
    className="log-entry"
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4 }}
  >
    {log}
  </motion.div>
);

export default Dashboard;
