const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { keycloak, memoryStore } = require("./keycloak-config");
const session = require("express-session");
require("dotenv").config();

const openstackRoutes = require('./routes/openstack.js');

console.log("🔹 Tentative d'authentification Keycloak...");
console.log("🔹 Client ID:", "myclient");
console.log("🔹 Client Secret:", "thQJgrym9MFTJKkSwwdMphci2qwotaQ6");
console.log("🔹 URL Keycloak:", "http://localhost:8080/realms/Aviom/protocol/openid-connect/token");


const app = express();
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));
app.use(express.json());

// 📌 Ajout du middleware Keycloak
app.use(session({
  secret: process.env.SESSION_SECRET || "some-secret-key",
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));
app.use(keycloak.middleware());
app.use("/api/openstack", openstackRoutes);


app.get('/', async (req, res) => {
  res.send('Backend Express pour OpenStack est en marche.');
});

// ✅ Route de redirection vers Keycloak pour l'authentification
app.get("/auth/login", (req, res) => {
  const authUrl = `http://localhost:8080/realms/Aviom/protocol/openid-connect/auth?client_id=myclient&response_type=code&scope=openid&redirect_uri=http://localhost:5173/callback`;
  res.redirect(authUrl);
});

// ✅ Route pour échanger le code d'autorisation contre un token d'accès
app.post("/api/exchange-token", async (req, res) => {
  try {
    const { code } = req.body;

    const response = await axios.post(
      "http://localhost:8080/realms/Aviom/protocol/openid-connect/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: "myclient",
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
        code,
        redirect_uri: "http://localhost:5173/callback",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    res.json(response.data);
  } catch (error) {
    console.error("❌ Erreur d'échange de code Keycloak:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Erreur lors de l'échange de code" });
  }
});

// ✅ Route pour la déconnexion
app.post("/api/logout", async (req, res) => {
  try {
    const { refresh_token } = req.body;
    await axios.post(
      "http://localhost:8080/realms/Aviom/protocol/openid-connect/logout",
      new URLSearchParams({
        client_id: "myclient",
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
        refresh_token
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    res.json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la déconnexion" });
  }
});

// ✅ Route protégée avec Keycloak
app.get("/api/protected", keycloak.protect("api_user"), (req, res) => {
  res.json({ message: "✅ Accès autorisé avec Keycloak" });
});



// ────────────────────────────────────────────────────────────────────────────────
// 🔹 **PAYPAL CONFIGURATION**
// ────────────────────────────────────────────────────────────────────────────────

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const BASE_URL = "https://api-m.sandbox.paypal.com";

console.log("📌 PAYPAL_CLIENT_ID:", PAYPAL_CLIENT_ID);
console.log("📌 PAYPAL_SECRET:", PAYPAL_SECRET);

// ✅ Route pour créer un paiement PayPal
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
    console.error("❌ Erreur PayPal:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Erreur lors de la création du paiement PayPal" });
  }
});

// ✅ Route pour récupérer le Client ID PayPal
app.get("/api/paypal/client-id", (req, res) => {
  if (!PAYPAL_CLIENT_ID) {
    return res.status(500).json({ error: "❌ Client ID PayPal non défini." });
  }
  res.json({ clientId: PAYPAL_CLIENT_ID });
});

// ────────────────────────────────────────────────────────────────────────────────
// 🔹 **GOCARDLESS CONFIGURATION**
// ────────────────────────────────────────────────────────────────────────────────

const GOCARDLESS_ACCESS_TOKEN = process.env.GOCARDLESS_ACCESS_TOKEN;
const GOCARDLESS_API_URL = "https://api-sandbox.gocardless.com";

console.log("📌 GOCARDLESS_ACCESS_TOKEN:", GOCARDLESS_ACCESS_TOKEN);

// ✅ Route pour créer un paiement GoCardless
app.post("/api/gocardless/create-payment", async (req, res) => {
  try {
    const response = await axios.post(
      `${GOCARDLESS_API_URL}/payments`,
      {
        payments: {
          amount: 1000, // 10.00 EUR (GoCardless utilise les centimes)
          currency: "EUR",
          links: { mandate: "MD00169GANW3RS" } // À remplacer par un mandat valide
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
    console.error("❌ Erreur GoCardless:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Erreur lors de la création du paiement GoCardless" });
  }
});

// ────────────────────────────────────────────────────────────────────────────────
// 🔹 **LANCEMENT DU SERVEUR**
// ────────────────────────────────────────────────────────────────────────────────
app.listen(5000, () => {
  console.log("✅ Serveur backend en écoute sur le port 5000");
});
