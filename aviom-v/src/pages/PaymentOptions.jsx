import React, { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

const PaymentOptions = () => {
  const [clientID, setClientID] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [error, setError] = useState("");

  // Récupération dynamique du PayPal Client ID depuis le backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/paypal/client-id")
      .then(response => {
        setClientID(response.data.clientId);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération du Client ID PayPal:", error);
        setError("Impossible de récupérer le Client ID PayPal.");
      });
  }, []);

  const handleGoCardlessPayment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/gocardless/create-payment",
        {
          amount: 1000,
          currency: "EUR",
          mandate: "MD00169GANWJ3RS" // Assurez-vous que ce mandat est valide
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
  
      console.log("Réponse GoCardless:", response.data);
  
      if (response.data.payments.id) {
        alert(`Paiement GoCardless initié ! ID: ${response.data.payments.id}`);
        
        // 🔴 Ajoutez ici la redirection après paiement vers une page de confirmation
        window.location.href = `/confirmation-paiement?paymentId=${response.data.payments.id}`;
      } else {
        console.warn("Aucune URL de redirection reçue.");
      }
    } catch (error) {
      console.error("Erreur GoCardless :", error);
      alert("Erreur lors du paiement GoCardless.");
    }
  };
  
  
  return (
    <div>
      <h2>Choisissez votre méthode de paiement</h2>

      {/* Affichage des erreurs si problème de récupération du Client ID */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Boutons de sélection des méthodes de paiement */}
      <button onClick={() => setSelectedPayment("paypal")}>Payer avec PayPal</button>
      <button onClick={() => setSelectedPayment("gocardless")}>Payer avec GoCardless</button>

      {/* Intégration du bouton PayPal uniquement si le Client ID est récupéré */}
      {clientID && selectedPayment === "paypal" && (
        <PayPalScriptProvider options={{ "client-id": clientID, currency: "EUR" }}>
          <PayPalButtons
            createOrder={async () => {
              try {
                const response = await axios.post("http://localhost:5000/api/paypal/create-payment");
                return response.data.orderID;
              } catch (error) {
                console.error("Erreur lors de la création de la commande PayPal:", error);
                throw new Error("Erreur lors de la création de la commande PayPal");
              }
            }}
            onApprove={async (data, actions) => {
              return actions.order.capture().then(details => {
                console.log("Paiement réussi :", details);
                alert("Paiement réussi !");
              });
            }}
          />
        </PayPalScriptProvider>
      )}

      {/* GoCardless */}
      {selectedPayment === "gocardless" && (
        <div>
          <p>Vous serez redirigé vers GoCardless pour finaliser le paiement.</p>
          <button onClick={handleGoCardlessPayment}>Confirmer le paiement</button>
          {error && <p style={{ color: "red" }}>{error}</p>} {/* Affichage des erreurs */}
        </div>
      )}
    </div>
  );
};


export default PaymentOptions;
