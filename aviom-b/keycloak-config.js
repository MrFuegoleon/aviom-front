const Keycloak = require("keycloak-connect");
const session = require("express-session");

const memoryStore = new session.MemoryStore();

const keycloak = new Keycloak(
  {
    store: memoryStore,
  },
  {
    realm: "Aviom",
    // On modifie l'URL du serveur d'authentification pour utiliser l'URL publique gérée par Nginx
    "auth-server-url": "http://localhost:8080/auth/",
    "ssl-required": "none",
    resource: "myclient",
    "public-client": false,
    "confidential-port": 0,
    credentials: {
      secret: process.env.KEYCLOAK_CLIENT_SECRET,
    },
  }
);

module.exports = { keycloak, memoryStore };
