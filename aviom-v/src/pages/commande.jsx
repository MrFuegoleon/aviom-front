import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import DomainEditor from "../components/DomaineEditor/DomaineEdit";
import "./commande.css";

const DomainManagement = () => {
  // Liste initiale des domaines
  const [domains, setDomains] = useState([
    { id: 1, name: "exemple.com", status: "Actif", renewal: "2025-06-30" },
    { id: 2, name: "mon-site.fr", status: "Expiré", renewal: "2024-12-15" },
    { id: 3, name: "domaine.net", status: "Actif", renewal: "2025-03-20" },
  ]);

  // Contrôle du modal d'ajout et d'édition
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);

  // Ajout d'un domaine
  const addDomain = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.domainName.value.trim();
    const renewal = form.renewal.value;
    if (!name || !renewal) return;
    const newId = domains.length ? Math.max(...domains.map((d) => d.id)) + 1 : 1;
    const newDomain = { id: newId, name, status: "Actif", renewal };
    setDomains([newDomain, ...domains]);
    form.reset();
    setShowAddModal(false);
  };

  // Suppression d'un domaine
  const deleteDomain = (id) => {
    setDomains(domains.filter((d) => d.id !== id));
  };

  // Sauvegarde des modifications depuis l'éditeur
  const saveDomainEdits = (editedDomain) => {
    setDomains(
      domains.map((d) => (d.id === editedDomain.id ? editedDomain : d))
    );
    setShowEditModal(false);
    setSelectedDomain(null);
  };

  // Ouverture de l'éditeur
  const openEditor = (domain) => {
    setSelectedDomain(domain);
    setShowEditModal(true);
  };

  return (
    <div className="dm-container">
      {/* Header */}
      <motion.header
        className="dm-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Gestion des Noms de Domaine</h1>
        <button className="dm-add-btn" onClick={() => setShowAddModal(true)}>
          <FaPlus /> Ajouter un domaine
        </button>
      </motion.header>

      {/* Liste des domaines */}
      <main className="dm-main">
        {domains.map((domain) => (
          <motion.div
            key={domain.id}
            className="dm-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="dm-info">
              <h2>{domain.name}</h2>
              <p>Status : {domain.status}</p>
              <p>Date de renouvellement : {domain.renewal}</p>
            </div>
            <div className="dm-actions">
              <button
                className="dm-edit-btn"
                onClick={() => openEditor(domain)}
              >
                <FaEdit />
              </button>
              <button
                className="dm-delete-btn"
                onClick={() => deleteDomain(domain.id)}
              >
                <FaTrash />
              </button>
            </div>
          </motion.div>
        ))}
      </main>

      {/* Modal d'ajout de domaine */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="dm-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="dm-modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Ajouter un nouveau domaine</h2>
              <form onSubmit={addDomain} className="dm-form">
                <label>
                  Nom de domaine :
                  <input
                    type="text"
                    name="domainName"
                    placeholder="exemple.com"
                  />
                </label>
                <label>
                  Date de renouvellement :
                  <input type="date" name="renewal" />
                </label>
                <div className="dm-form-actions">
                  <button type="submit" className="dm-submit-btn">
                    Créer
                  </button>
                  <button
                    type="button"
                    className="dm-cancel-btn"
                    onClick={() => setShowAddModal(false)}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal d'édition de domaine */}
      <AnimatePresence>
        {showEditModal && selectedDomain && (
          <DomainEditor
            domain={selectedDomain}
            onSave={saveDomainEdits}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedDomain(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DomainManagement;
