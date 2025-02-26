import React, { useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import DomainEditor from "../components/DomaineEditor/DomaineEdit";
import './commande.css'

const DomainManagement = () => {
  const [domains, setDomains] = useState([
    { id: 1, name: "exemple.com", status: "Actif", renewal: "2025-06-30" },
    { id: 2, name: "mon-site.fr", status: "Expiré", renewal: "2024-12-15" },
    { id: 3, name: "domaine.net", status: "Actif", renewal: "2025-03-20" },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);

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

  const deleteDomain = (id) => {
    setDomains(domains.filter((d) => d.id !== id));
  };

  const saveDomainEdits = (editedDomain) => {
    setDomains(domains.map((d) => (d.id === editedDomain.id ? editedDomain : d)));
    setShowEditModal(false);
    setSelectedDomain(null);
  };

  const openEditor = (domain) => {
    setSelectedDomain(domain);
    setShowEditModal(true);
  };

  return (
    <>
      <header className="dm-header">
        <h1>Gestion des Noms de Domaine</h1>
        <div className="dm-stats">
          <div className="dm-stat">
            <span>Total: {domains.length}</span>
          </div>
          <div className="dm-stat">
            <span>Actifs: {domains.filter(d => d.status === "Actif").length}</span>
          </div>
          <div className="dm-stat">
            <span>Expirés: {domains.filter(d => d.status === "Expiré").length}</span>
          </div>
        </div>
        <button className="dm-add-btn" onClick={() => setShowAddModal(true)}>
          <FaPlus /> Ajouter un domaine
        </button>
      </header>

      <main className="dm-main">
        <div className="dm-table">
          <div className="dm-table-header">
            <div className="dm-col-domain">Nom de domaine</div>
            <div className="dm-col-status">Status</div>
            <div className="dm-col-renewal">Renouvellement</div>
            <div className="dm-col-actions">Actions</div>
          </div>
          {domains.map((domain) => (
            <div key={domain.id} className="dm-table-row">
              <div className="dm-col-domain">{domain.name}</div>
              <div className="dm-col-status">
                <span className={`dm-status-badge ${domain.status.toLowerCase()}`}>
                  {domain.status}
                </span>
              </div>
              <div className="dm-col-renewal">
                {new Date(domain.renewal).toLocaleDateString()}
              </div>
              <div className="dm-col-actions">
                <button
                  className="dm-edit-btn"
                  onClick={() => openEditor(domain)}
                  aria-label="Modifier"
                >
                  <FaEdit />
                </button>
                <button
                  className="dm-delete-btn"
                  onClick={() => deleteDomain(domain.id)}
                  aria-label="Supprimer"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showAddModal && (
        <div className="dm-modal-overlay">
          <div className="dm-modal-content">
            <div className="dm-modal-header">
              <h2>Ajouter un nouveau domaine</h2>
              <button 
                className="dm-close-btn"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={addDomain} className="dm-form">
              <div className="dm-form-group">
                <label htmlFor="domainName">Nom de domaine</label>
                <input
                  type="text"
                  id="domainName"
                  name="domainName"
                  placeholder="exemple.com"
                  required
                />
              </div>
              <div className="dm-form-group">
                <label htmlFor="renewal">Date de renouvellement</label>
                <input 
                  type="date" 
                  id="renewal" 
                  name="renewal" 
                  required 
                />
              </div>
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
          </div>
        </div>
      )}

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

      <style>{`
        body {
          margin: 0;
          padding: 0;
          background: #f8fafc;
          min-height: 100vh;
        }

        .dm-header {
          background: white;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .dm-header h1 {
          font-size: 1.5rem;
          color: #1a202c;
          margin: 0;
          white-space: nowrap;
        }

        .dm-stats {
          display: flex;
          gap: 2rem;
          margin-left: auto;
        }

        .dm-stat {
          color: #475569;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .dm-add-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
        }

        .dm-add-btn:hover {
          background-color: #1d4ed8;
        }

        .dm-main {
          padding: 2rem;
        }

        .dm-table {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .dm-table-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 120px;
          padding: 1rem 1.5rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          font-weight: 500;
          color: #475569;
        }

        .dm-table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 120px;
          padding: 1rem 1.5rem;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
        }

        .dm-table-row:last-child {
          border-bottom: none;
        }

        .dm-table-row:hover {
          background: #f8fafc;
        }

        .dm-col-domain {
          color: #1a202c;
          font-weight: 500;
        }

        .dm-status-badge {
          display: inline-flex;
          padding: 0.25rem 0.75rem;
          border-radius: 2rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .dm-status-badge.actif {
          background: #dcfce7;
          color: #166534;
        }

        .dm-status-badge.expiré {
          background: #fee2e2;
          color: #991b1b;
        }

        .dm-col-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
        }

        .dm-edit-btn,
        .dm-delete-btn {
          padding: 0.5rem;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dm-edit-btn {
          background-color: #f1f5f9;
          color: #475569;
        }

        .dm-edit-btn:hover {
          background-color: #e2e8f0;
        }

        .dm-delete-btn {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .dm-delete-btn:hover {
          background-color: #fecaca;
        }

        .dm-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          z-index: 50;
        }

        .dm-modal-content {
          background: white;
          border-radius: 0.5rem;
          width: 100%;
          max-width: 500px;
        }

        .dm-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .dm-modal-header h2 {
          font-size: 1.25rem;
          color: #1a202c;
          margin: 0;
        }

        .dm-close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #64748b;
          cursor: pointer;
          padding: 0.25rem;
        }

        .dm-form {
          padding: 1.5rem;
        }

        .dm-form-group {
          margin-bottom: 1.5rem;
        }

        .dm-form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #475569;
        }

        .dm-form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          font-size: 1rem;
        }

        .dm-form-group input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .dm-form-actions {
          display: flex;
          gap: 1rem;
        }

        .dm-submit-btn,
        .dm-cancel-btn {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
        }

        .dm-submit-btn {
          background-color: #2563eb;
          color: white;
        }

        .dm-submit-btn:hover {
          background-color: #1d4ed8;
        }

        .dm-cancel-btn {
          background-color: #f1f5f9;
          color: #475569;
        }

        .dm-cancel-btn:hover {
          background-color: #e2e8f0;
        }

        @media (max-width: 768px) {
          .dm-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
            padding: 1rem;
          }

          .dm-stats {
            justify-content: space-between;
            margin: 0;
          }

          .dm-table-header,
          .dm-table-row {
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
            padding: 1rem;
          }

          .dm-col-renewal {
            display: none;
          }

          .dm-col-actions {
            grid-column: 2;
            justify-content: flex-end;
          }
        }
      `}</style>
    </>
  );
};

export default DomainManagement;