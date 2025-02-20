import React, { useState } from "react";

const Facturation = () => {
  const [invoices, setInvoices] = useState([
    { id: "FAC-2024-001", date: "01/01/2024", montant: "120.00€", statut: "Payé" },
    { id: "FAC-2024-002", date: "15/01/2024", montant: "80.50€", statut: "En attente" },
    { id: "FAC-2024-003", date: "28/01/2024", montant: "200.00€", statut: "Payé" },
    { id: "FAC-2024-004", date: "05/02/2024", montant: "150.75€", statut: "En attente" },
  ]);

  return (
    <div className="facturation-container">
      <div className="facturation-wrapper">
        {/* Header Section */}
        <div className="header-section">
          <h1>Facturation & Paiement</h1>
          <p>Consultez l'historique de vos paiements et gérez vos factures en toute simplicité.</p>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total facturé</h3>
            <p>551.25€</p>
          </div>
          <div className="summary-card">
            <h3>En attente</h3>
            <p className="pending">231.25€</p>
          </div>
          <div className="summary-card">
            <h3>Payé</h3>
            <p className="paid">320.00€</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Facture</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((facture) => (
                <tr key={facture.id}>
                  <td className="invoice-id">{facture.id}</td>
                  <td>{facture.date}</td>
                  <td className="amount">{facture.montant}</td>
                  <td>
                    <span className={`status-badge ${facture.statut === "Payé" ? "paid" : "pending"}`}>
                      {facture.statut}
                    </span>
                  </td>
                  <td className="actions">
                    {facture.statut === "En attente" && (
                      <button className="pay-button">Payer</button>
                    )}
                    <button className="download-button">Télécharger</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .facturation-container {
          min-height: 100vh;
          padding: 2rem;
          background-color: #f9fafb;
        }

        .facturation-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .header-section {
          margin-bottom: 2rem;
        }

        .header-section h1 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .header-section p {
          color: #6b7280;
          font-size: 1rem;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .summary-card {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .summary-card h3 {
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.25rem;
        }

        .summary-card p {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .summary-card p.pending {
          color: #2563eb;
        }

        .summary-card p.paid {
          color: #059669;
        }

        .table-container {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          text-align: left;
          padding: 1rem 1.5rem;
          background-color: #f9fafb;
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
          border-bottom: 1px solid #e5e7eb;
        }

        td {
          padding: 1rem 1.5rem;
          color: #1f2937;
          font-size: 0.875rem;
          border-bottom: 1px solid #e5e7eb;
        }

        tr:hover {
          background-color: #f9fafb;
        }

        .invoice-id {
          font-weight: 500;
        }

        .amount {
          font-weight: 500;
        }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-badge.paid {
          background-color: #d1fae5;
          color: #065f46;
        }

        .status-badge.pending {
          background-color: #dbeafe;
          color: #1e40af;
        }

        .actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
        }

        button {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pay-button {
          background-color: #2563eb;
          color: white;
          border: none;
        }

        .pay-button:hover {
          background-color: #1d4ed8;
        }

        .download-button {
          background-color: white;
          color: #4b5563;
          border: 1px solid #e5e7eb;
        }

        .download-button:hover {
          background-color: #f9fafb;
        }

        @media (max-width: 768px) {
          .facturation-container {
            padding: 1rem;
          }

          .table-container {
            overflow-x: auto;
          }

          .summary-cards {
            grid-template-columns: 1fr;
          }

          td, th {
            padding: 0.75rem 1rem;
          }

          .actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Facturation;