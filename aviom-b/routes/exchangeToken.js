const express = require('express');
const router = express.Router();
const app = express();
const axios = require("axios");


// ✅ Route pour échanger le code d'autorisation contre un token d'accès
router.post("/", async (req, res) => {

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

module.exports = router;


