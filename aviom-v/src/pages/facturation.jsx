import React, { useState } from "react";
import CancelSubscriptionButton from "../components/CancelSubscriptionButton";
import "./facturation.css";

const Facturation = () => {
  const [invoices, setInvoices] = useState([
    { id: "FAC-2024-001", date: "01/01/2024", montant: "120.00€", statut: "Payé" },
    { id: "FAC-2024-002", date: "15/01/2024", montant: "80.50€", statut: "En attente" },
    { id: "FAC-2024-003", date: "28/01/2024", montant: "200.00€", statut: "Payé" },
    { id: "FAC-2024-004", date: "05/02/2024", montant: "150.75€", statut: "En attente" },
  ]);

  // Dynamic state to control subscription cancellation
  const [subscriptionActive, setSubscriptionActive] = useState(true);

  const handleCancelSubscription = () => {
    // Add any logic you need here (e.g., API call to cancel subscription)
    setSubscriptionActive(false);
  };

  return (
    <div className="facturation-container">
      <div className="facturation-wrapper">
        {/* Header Section */}
        <div className="header-section">
          <h1>Facturation & Paiement</h1>
          <p>
            Consultez l'historique de vos paiements et gérez vos factures en toute simplicité.
          </p>
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
                    <span
                      className={`status-badge ${
                        facture.statut === "Payé" ? "paid" : "pending"
                      }`}
                    >
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

        {/* Cancel Subscription Section (positioned below the table) */}
        <div className="cancel-subscription-container">
          {subscriptionActive ? (
            <CancelSubscriptionButton onCancel={handleCancelSubscription} />
          ) : (
            <div className="subscription-cancelled-message">
              Votre abonnement a été annulé.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Facturation;
