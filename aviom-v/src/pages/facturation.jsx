import React, { useState } from "react";
import "./facturation.css";

const Facturation = () => {
  const [invoices, setInvoices] = useState([
    { id: 1, date: "01/01/2024", montant: "120.00€", statut: "Payé" },
    { id: 2, date: "15/01/2024", montant: "80.50€", statut: "En attente" },
    { id: 3, date: "28/01/2024", montant: "200.00€", statut: "Payé" },
  ]);

  return (
    <div className="facturation-container">
      <h1 className="title">Facturation & Paiement</h1>
      <p className="subtitle">
        Consultez l'historique de vos paiements et gérez vos factures en toute
        simplicité.
      </p>

      <div className="facturation-content">
        <table className="facture-table">
          <thead>
            <tr>
              <th>ID Facture</th>
              <th>Date</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((facture) => (
              <tr key={facture.id}>
                <td>{facture.id}</td>
                <td>{facture.date}</td>
                <td>{facture.montant}</td>
                <td
                  className={`status ${
                    facture.statut === "Payé" ? "paid" : "pending"
                  }`}
                >
                  {facture.statut}
                </td>
                <td>
                  {facture.statut === "En attente" && (
                    <button className="pay-btn">Payer</button>
                  )}
                  <button className="download-btn">Télécharger</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Facturation;
