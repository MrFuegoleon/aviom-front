const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
console.log("PAYPAL_CLIENT_ID:", process.env.PAYPAL_CLIENT_ID);
console.log("PAYPAL_SECRET:", process.env.PAYPAL_SECRET);


const app = express();
app.use(cors());
app.use(express.json());

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const BASE_URL = "https://api-m.sandbox.paypal.com"; // Utilise sandbox pour tester

// Route pour créer un paiement PayPal
app.post("/api/paypal/create-payment", async (req, res) => {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");
    const response = await axios.post(`${BASE_URL}/v2/checkout/orders`, {
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: "EUR", value: "10.00" } }]
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`
      }
    });

    res.json({ orderID: response.data.id });
  } catch (error) {
    console.error("Erreur PayPal:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Erreur lors de la création du paiement PayPal" });
  }
});

console.log("Routes enregistrées :");
app._router.stack.forEach((r) => {
  if (r.route) {
    console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
  }
});
app.get("/api/paypal/client-id", (req, res) => {
  if (!process.env.PAYPAL_CLIENT_ID) {
    return res.status(500).json({ error: "Client ID PayPal non défini dans les variables d'environnement." });
  }
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID });
});



const GOCARDLESS_ACCESS_TOKEN = process.env.GOCARDLESS_ACCESS_TOKEN;
const GOCARDLESS_ENVIRONMENT = process.env.GOCARDLESS_ENVIRONMENT || "sandbox";
const GOCARDLESS_API_URL = "https://api-sandbox.gocardless.com"; 
console.log("GOCARDLESS_ACCESS_TOKEN:", process.env.GOCARDLESS_ACCESS_TOKEN);
console.log("GOCARDLESS_ENVIRONMENT:", process.env.GOCARDLESS_ENVIRONMENT);

// Route pour créer un paiement GoCardless
app.post("/api/gocardless/create-payment", async (req, res) => {
  try {
    const response = await axios.post(
      `${GOCARDLESS_API_URL}/payments`,
      {
        payments: {
          amount: 1000, // 10.00 EUR (GoCardless utilise les centimes)
          currency: "EUR",
          links: {
            mandate: "MD00169GANW3RS" // Remplace par un mandat valide
          }
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GOCARDLESS_ACCESS_TOKEN}`,
          "GoCardless-Version": "2015-07-06"
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Erreur GoCardless:", error.response ? error.response.data : error.message);
    if (error.response) {
        console.log("Détails de l'erreur GoCardless:", error.response.data);
    }
    res.status(500).json({ error: "Erreur lors de la création du paiement GoCardless", details: error.response ? error.response.data : error.message });
}
});

// Vérifie les routes disponibles
console.log("Routes enregistrées :");
app._router.stack.forEach((r) => {
  if (r.route) {
    console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
  }
});
// Vérifie les routes disponibles après le démarrage du serveur
app.listen(5000, () => {
  console.log("✅ Serveur backend en écoute sur le port 5000");
  console.log("📌 Routes enregistrées :");
  app._router.stack.forEach((r) => {
      if (r.route) {
          console.log(`🔹 ${Object.keys(r.route.methods)} ${r.route.path}`);
      }
  });
});
