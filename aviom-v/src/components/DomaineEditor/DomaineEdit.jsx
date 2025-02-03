import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import "../../pages/commande.css";

const DomainEditor = ({ domain, onSave, onCancel }) => {
  const [editedDomain, setEditedDomain] = useState(domain);

  // Mettre à jour l'état si le domaine sélectionné change
  useEffect(() => {
    setEditedDomain(domain);
  }, [domain]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedDomain);
  };

  return (
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
        <div className="dm-modal-header">
          <h2>Éditer le domaine</h2>
          <button className="dm-close-btn" onClick={onCancel}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="dm-form">
          <label>
            Nom de domaine :
            <input
              type="text"
              value={editedDomain.name}
              onChange={(e) =>
                setEditedDomain({ ...editedDomain, name: e.target.value })
              }
              placeholder="exemple.com"
            />
          </label>
          <label>
            Statut :
            <select
              value={editedDomain.status}
              onChange={(e) =>
                setEditedDomain({ ...editedDomain, status: e.target.value })
              }
            >
              <option value="Actif">Actif</option>
              <option value="Expiré">Expiré</option>
              <option value="En attente">En attente</option>
            </select>
          </label>
          <label>
            Date de renouvellement :
            <input
              type="date"
              value={editedDomain.renewal}
              onChange={(e) =>
                setEditedDomain({ ...editedDomain, renewal: e.target.value })
              }
            />
          </label>
          <div className="dm-form-actions">
            <button type="submit" className="dm-submit-btn">
              Enregistrer
            </button>
            <button type="button" className="dm-cancel-btn" onClick={onCancel}>
              Annuler
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default DomainEditor;
