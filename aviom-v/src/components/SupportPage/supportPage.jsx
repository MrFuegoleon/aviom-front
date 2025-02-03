import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheckCircle,
  FaSearch,
  FaFileAlt,
  FaCloud,
  FaServer,
  FaGlobe,
  FaLifeRing
} from "react-icons/fa";
import "./SupportPage.css";

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState("tickets");
  const [searchQuery, setSearchQuery] = useState("");
  const [tickets, setTickets] = useState([
    { id: 1, title: "Problème de connexion VM", status: "En cours" },
    { id: 2, title: "Migration de domaine", status: "Résolu" }
  ]);
  
  // États pour le formulaire modal
  const [showForm, setShowForm] = useState(false);
  const [newTicketTitle, setNewTicketTitle] = useState("");
  const [newTicketDescription, setNewTicketDescription] = useState("");

  // Fonction de soumission du ticket
  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!newTicketTitle.trim()) return;

    const newTicket = {
      id: tickets.length + 1,
      title: newTicketTitle,
      status: "En cours",
      description: newTicketDescription
    };

    setTickets([newTicket, ...tickets]);
    setNewTicketTitle("");
    setNewTicketDescription("");
    setShowForm(false);
  };

  return (
    <div className="container">
      {/* Barre de navigation */}
      <motion.nav
        className="navbar"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="nav-left">
          <h2 className="logo" style={{color:"white"}}>Support Technique</h2>
          <div className="nav-items">
            <NavItem
              icon={<FaFileAlt />}
              text="Mes Tickets"
              active={activeTab === "tickets"}
              onClick={() => setActiveTab("tickets")}
            />
            <NavItem
              icon={<FaLifeRing />}
              text="Support"
              active={activeTab === "support"}
              onClick={() => setActiveTab("support")}
            />
          </div>
        </div>
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className="search-input"
          />
          <FaSearch className="search-icon" />
        </div>
      </motion.nav>

      {/* Contenu principal */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          {activeTab === "tickets" && (
            <motion.div
              key="tickets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="content-wrapper"
            >
              <h1 className="page-title">Gestion des Tickets</h1>
              <div className="card">
                <div className="card-header">
                  <h3>Mes Demandes de Support</h3>
                  <button
                    className="primary-button"
                    onClick={() => setShowForm(true)}
                  >
                    + Nouveau Ticket
                  </button>
                </div>
                <div className="ticket-list">
                  {tickets.map((ticket) => (
                    <TicketItem key={ticket.id} {...ticket} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "support" && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="content-wrapper"
            >
              <h1 className="page-title">Support Technique</h1>
              <div className="support-grid">
                <SupportOption
                  icon={<FaCloud size={40} />}
                  title="Support Cloud"
                  description="Assistance pour vos services cloud"
                />
                <SupportOption
                  icon={<FaServer size={40} />}
                  title="Support VM"
                  description="Aide pour vos machines virtuelles"
                />
                <SupportOption
                  icon={<FaGlobe size={40} />}
                  title="Support Domaines"
                  description="Gestion de vos noms de domaine"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Formulaire Modal pour nouveau ticket */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Nouveau Ticket</h2>
              <form onSubmit={handleTicketSubmit} className="form">
                <label className="form-label">
                  Titre du ticket
                  <input
                    type="text"
                    value={newTicketTitle}
                    onChange={(e) => setNewTicketTitle(e.target.value)}
                    className="form-input"
                    placeholder="Titre..."
                    required
                  />
                </label>
                <label className="form-label">
                  Description
                  <textarea
                    value={newTicketDescription}
                    onChange={(e) => setNewTicketDescription(e.target.value)}
                    className="form-input textarea"
                    placeholder="Décrivez votre problème..."
                  />
                </label>
                <div className="form-buttons">
                  <button type="submit" className="primary-button">
                    Créer le ticket
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setShowForm(false)}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Composant NavItem
const NavItem = ({ icon, text, active, onClick }) => (
  <motion.div
    className={`nav-item ${active ? "active" : ""}`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    {icon}
    <span>{text}</span>
  </motion.div>
);

// Composant TicketItem
const TicketItem = ({ id, title, status, description }) => {
  const statusClass = status === "Résolu" ? "status-resolved" : "status-pending";
  return (
    <motion.div
      className="ticket-item"
      whileHover={{ scale: 1.02 }}
    >
      <div className="ticket-info">
        <h4>{title}</h4>
        {description && <small>{description}</small>}
        <br />
        <small>Ticket #{id}</small>
      </div>
      <div className={`ticket-status ${statusClass}`}>
        {status}
      </div>
    </motion.div>
  );
};

// Composant SupportOption
const SupportOption = ({ icon, title, description }) => (
  <motion.div
    className="support-option"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="support-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </motion.div>
);

export default SupportPage;
