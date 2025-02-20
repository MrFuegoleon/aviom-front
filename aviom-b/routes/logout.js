const express = require('express');
const router = express.Router();
const app = express();
const axios = require("axios");

// ✅ Route pour la déconnexion
router.post("/", async (req, res) => {

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

  module.exports = router;