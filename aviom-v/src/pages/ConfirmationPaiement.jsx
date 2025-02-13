import React from "react";
import { useLocation } from "react-router-dom";

const ConfirmationPaiement = () => {
  const query = new URLSearchParams(useLocation().search);
  const paymentId = query.get("paymentId");

  return (
    <div>
      <h1>Paiement réussi ! ✅</h1>
      <p>Votre paiement GoCardless a été initié avec succès.</p>
      <p><strong>ID du paiement :</strong> {paymentId}</p>
      <a href="/">Retour à l'accueil</a>
    </div>
  );
};

export default ConfirmationPaiement;
