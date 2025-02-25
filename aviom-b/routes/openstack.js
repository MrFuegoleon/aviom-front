const express = require("express");
const axios = require("axios");
const fs = require("fs");

const router = express.Router();

// Configuration OpenStack
const OS_IDENTITY_URL = "http://156.18.114.237:5000/v3"; // Endpoint Keystone (v3)
const OS_USERNAME = "admin";
const OS_PASSWORD = "vwURv2tz5vQQ32FmVfFYfmvW6Yds01QGgzFR10F6";
const OS_PROJECT_NAME = "test";
const OS_DOMAIN_ID = "default";

// URL de l'API Nova
const OS_NOVA_URL = "http://156.18.114.237:8774/v2.1";

// Nom de la paire de clés
const KEYPAIR_NAME = "mykey";
const KEYPAIR_FILE = "mykey.pem";

//  Fonction pour obtenir un token OpenStack
async function getAuthToken() {
  try {
    const authPayload = {
      auth: {
        identity: {
          methods: ["password"],
          password: {
            user: {
              name: OS_USERNAME,
              domain: { id: OS_DOMAIN_ID },
              password: OS_PASSWORD,
            },
          },
        },
        scope: {
          project: {
            name: OS_PROJECT_NAME,
            domain: { id: OS_DOMAIN_ID },
          },
        },
      },
    };

    const response = await axios.post(`${OS_IDENTITY_URL}/auth/tokens`, authPayload, {
      headers: { "Content-Type": "application/json" },
    });

    return response.headers["x-subject-token"];
  } catch (error) {
    console.error("Erreur d'authentification:", error.response?.data || error.message);
    throw new Error("Authentification OpenStack échouée");
  }
}

//  Fonction pour vérifier/créer une paire de clés
async function ensureKeypairExists(token) {
  try {
    await axios.get(`${OS_NOVA_URL}/os-keypairs/${KEYPAIR_NAME}`, {
      headers: { "X-Auth-Token": token },
    });
    console.log(`La paire de clés "${KEYPAIR_NAME}" existe déjà.`);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.log(`La paire de clés "${KEYPAIR_NAME}" n'existe pas, création en cours...`);
      const createResponse = await axios.post(
        `${OS_NOVA_URL}/os-keypairs`,
        { keypair: { name: KEYPAIR_NAME } },
        { headers: { "X-Auth-Token": token, "Content-Type": "application/json" } }
      );

      const privateKey = createResponse.data.keypair.private_key;
      if (privateKey) {
        fs.writeFileSync(KEYPAIR_FILE, privateKey, { mode: 0o600 });
        console.log(`Clé privée sauvegardée dans ${KEYPAIR_FILE}`);
      }
    } else {
      throw err;
    }
  }
}

// Créer une VM
router.post("/create-vm", async (req, res) => {
  try {
    const { flavorRef, name } = req.body;
    const token = await getAuthToken();
    await ensureKeypairExists(token);

    const serverPayload = {
      server: {
        name: name || "myVM", // Use the name from the request or default to "myVM"
        imageRef: "8e0a53a0-f84b-4e0f-b0f5-89b8414fc468", // Replace with your image ID
        flavorRef: flavorRef, // Use the flavorRef from the request
        networks: [{ uuid: "6bbb744b-3f6e-4baa-947e-0964f6aa6fd1" }], // Replace with your network ID
        key_name: KEYPAIR_NAME,
      },
    };

    const novaResponse = await axios.post(`${OS_NOVA_URL}/servers`, serverPayload, {
      headers: { "X-Auth-Token": token, "Content-Type": "application/json" },
    });

    res.status(200).json({ message: "VM créée avec succès", data: novaResponse.data.server });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la VM", error: error.response?.data || error.message });
  }
});

// Redémarrer une VM
router.post("/reboot-vm/:id", async (req, res) => {
  try {
    const token = await getAuthToken();
    const { id } = req.params;
    const { type } = req.body;

    await axios.post(
      `${OS_NOVA_URL}/servers/${id}/action`,
      { reboot: { type: type || "SOFT" } }, // Default to SOFT if type is not provided
      { headers: { "X-Auth-Token": token, "Content-Type": "application/json" } }
    );

    res.json({ message: "VM redémarrée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du redémarrage de la VM", error: error.response?.data || error.message });
  }
});

// Modifier une VM (changer RAM, CPU et Disque)
router.put("/resize-vm/:id", async (req, res) => {
  try {
    const token = await getAuthToken();
    const { id } = req.params;
    const { ram, vcpus, disk } = req.body;

    // Vérifier si les valeurs sont valides
    if (!ram || !vcpus || !disk) {
      return res.status(400).json({ message: "RAM, CPU et disque sont obligatoires." });
    }

    // Obtenir la liste des flavors pour trouver celui correspondant
    const flavorsResponse = await axios.get(`${OS_NOVA_URL}/flavors/detail`, {
      headers: { "X-Auth-Token": token },
    });

    const flavors = flavorsResponse.data.flavors;

    // Rechercher un flavor correspondant aux nouvelles spécifications
    const matchingFlavor = flavors.find(f => 
      f.ram === parseInt(ram) && f.vcpus === parseInt(vcpus) && f.disk === parseInt(disk)
    );

    if (!matchingFlavor) {
      return res.status(404).json({ message: "Aucun flavor ne correspond aux spécifications fournies." });
    }

    // Modifier la VM en appliquant le nouveau flavor
    await axios.post(
      `${OS_NOVA_URL}/servers/${id}/action`,
      { resize: { flavorRef: matchingFlavor.id } },
      { headers: { "X-Auth-Token": token, "Content-Type": "application/json" } }
    );

    res.json({ message: "VM mise à jour avec succès.", flavor: matchingFlavor.id });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la VM", error: error.response?.data || error.message });
  }
});


// **Supprimer une VM
router.delete("/delete-vm/:id", async (req, res) => {
  try {
    const token = await getAuthToken();
    const { id } = req.params;

    await axios.delete(`${OS_NOVA_URL}/servers/${id}`, {
      headers: { "X-Auth-Token": token },
    });

    res.json({ message: "VM supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la VM", error: error.response?.data || error.message });
  }
});

// Démarrer une VM
router.post("/start-vm/:id", async (req, res) => {
  try {
    const token = await getAuthToken();
    const { id } = req.params;

    await axios.post(
      `${OS_NOVA_URL}/servers/${id}/action`,
      { "os-start": null },
      { headers: { "X-Auth-Token": token, "Content-Type": "application/json" } }
    );

    res.json({ message: "VM démarrée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du démarrage de la VM", error: error.response?.data || error.message });
  }
});

// Arrêter une VM
router.post("/stop-vm/:id", async (req, res) => {
  try {
    const token = await getAuthToken();
    const { id } = req.params;

    await axios.post(
      `${OS_NOVA_URL}/servers/${id}/action`,
      { "os-stop": null },
      { headers: { "X-Auth-Token": token, "Content-Type": "application/json" } }
    );

    res.json({ message: "VM arrêtée avec succès" });
  } catch (error) {
    res.status(500).json({ message: " Erreur lors de l'arrêt de la VM", error: error.response?.data || error.message });
  }
});

// Lister toutes les VMs du projet
router.get("/list-vms", async (req, res) => {
  try {
    const token = await getAuthToken();

    const response = await axios.get(`${OS_NOVA_URL}/servers/detail`, {
      headers: { "X-Auth-Token": token },
    });

    res.json({ message: "Liste des VMs récupérée", data: response.data.servers });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des VMs", error: error.response?.data || error.message });
  }
});

// Get all flavors
router.get("/flavors", async (req, res) => {
  try {
    const token = await getAuthToken();

    const response = await axios.get(`${OS_NOVA_URL}/flavors/detail`, {
      headers: { "X-Auth-Token": token },
    });

    res.json({ message: "Flavors récupérés", data: response.data.flavors });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des flavors", error: error.response?.data || error.message });
  }
});

// Confirmer le redimensionnement
router.post("/confirm-resize/:id", async (req, res) => {
  try {
    const token = await getAuthToken();
    const { id } = req.params;

    await axios.post(
      `${OS_NOVA_URL}/servers/${id}/action`,
      { confirmResize: null },
      { headers: { "X-Auth-Token": token, "Content-Type": "application/json" } }
    );

    res.json({ message: "Redimensionnement confirmé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la confirmation du redimensionnement", error: error.response?.data || error.message });
  }
});

// Annuler le redimensionnement
router.post("/revert-resize/:id", async (req, res) => {
  try {
    const token = await getAuthToken();
    const { id } = req.params;

    await axios.post(
      `${OS_NOVA_URL}/servers/${id}/action`,
      { revertResize: null },
      { headers: { "X-Auth-Token": token, "Content-Type": "application/json" } }
    );

    res.json({ message: "Redimensionnement annulé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'annulation du redimensionnement", error: error.response?.data || error.message });
  }
});










// Get all instances in a project
router.get("/instances", async (req, res) => {
  try {
    const { projectId } = req.query;
    const token = await getAuthToken(OS_USERNAME, OS_PASSWORD, projectId);

    const response = await axios.get(`${OS_NOVA_URL}/servers/detail`, {
      headers: { "X-Auth-Token": token }
    });

    res.json({ instances: response.data.servers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching instances", error: error.message });
  }
});

// Get specific instance details with metrics
router.get("/instance/:id", async (req, res) => {
  try {
    const { projectId } = req.query;
    const { id } = req.params;
    const token = await getAuthToken(OS_USERNAME, OS_PASSWORD, projectId);

    // Get basic instance details
    const instanceRes = await axios.get(`${OS_NOVA_URL}/servers/${id}`, {
      headers: { "X-Auth-Token": token }
    });

    // Get metrics (requires OpenStack Telemetry - ceilometer/gnocchi)
    const metricsRes = await axios.get(
      `http://156.18.114.237:8777/v2/meters/(cpu_util|memory.usage|disk.usage)/statistics`,
      {
        headers: { "X-Auth-Token": token },
        params: {
          q: [{ field: "resource_id", op: "eq", value: id }],
          period: 3600 // 1 hour window
        }
      }
    );

    res.json({
      instance: instanceRes.data.server,
      metrics: metricsRes.data
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching instance details", error: error.message });
  }
});

module.exports = router;
