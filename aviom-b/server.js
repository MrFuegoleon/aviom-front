const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { keycloak, memoryStore } = require("./keycloak-config");
const session = require("express-session");
require("dotenv").config();

const openstackRoutes = require("./routes/openstack.js");
const gocardlessRoutes = require("./routes/gocardless.js");
const paypalRoutes = require("./routes/paypal.js");
const exchangeTokenRoutes = require("./routes/exchangeToken.js");
const logoutRoutes = require("./routes/logout");

console.log("🔹 Tentative d'authentification Keycloak...");
console.log("🔹 Client ID:", "myclient");
console.log("🔹 Client Secret:", "6cm46sHZe3yqykWDHvnWPcwnjJRtl2wN");
console.log(
  "🔹 URL Keycloak:",
  "http://localhost:8080/realms/Aviom/protocol/openid-connect/token"
);

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

// 📌 Ajout du middleware Keycloak
app.use(
  session({
    secret: process.env.SESSION_SECRET || "some-secret-key",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);
app.use(keycloak.middleware());
app.use("/api/openstack", openstackRoutes);
app.use("/api/gocardless", gocardlessRoutes);
app.use("/api/paypal", paypalRoutes);
app.use("/api/exchange-token", exchangeTokenRoutes);
app.use("/api/logout", logoutRoutes);

app.get("/", async (req, res) => {
  res.send("Backend Express pour OpenStack est en marche.");
});

// ✅ Route de redirection vers Keycloak pour l'authentification
app.get("/auth/login", (req, res) => {
  const authUrl = `http://localhost:8080/realms/Aviom/protocol/openid-connect/auth?client_id=myclient&response_type=code&scope=openid&redirect_uri=http://localhost:5173/callback `;
  res.redirect(authUrl);
});

// ✅ Route protégée avec Keycloak
app.get("/api/protected", keycloak.protect("api_user"), (req, res) => {
  res.json({ message: "✅ Accès autorisé avec Keycloak" });
});

// ────────────────────────────────────────────────────────────────────────────────
// 🔹 *LANCEMENT DU SERVEUR*
// ────────────────────────────────────────────────────────────────────────────────
app.listen(5000, () => {
  console.log("✅  port 5000");
});
