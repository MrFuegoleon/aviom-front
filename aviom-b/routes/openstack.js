// routes/openstack.js
const express = require('express');
const router = express.Router();
const app = express();

// Configuration OpenStack (à adapter et sécuriser)
const OS_IDENTITY_URL = 'http://156.18.114.237:5000/v3'; // Endpoint Keystone (v3)
const OS_USERNAME = 'admin';
const OS_PASSWORD = 'vwURv2tz5vQQ32FmVfFYfmvW6Yds01QGgzFR10F6';
const OS_PROJECT_NAME = 'admin';
const OS_DOMAIN_ID = 'default';

// URL de l'API Nova
const OS_NOVA_URL = 'http://156.18.114.237:8774/v2.1';

// Nom de la paire de clés à utiliser/créer
const KEYPAIR_NAME = 'mykey';
// Chemin pour sauvegarder la clé privée (si création de la paire)
const KEYPAIR_FILE = 'mykey.pem';

// Fonction pour vérifier si la paire de clés existe et la créer si nécessaire
async function ensureKeypairExists(token) {
  try {
    // Tenter de récupérer la paire de clés existante
    const getResponse = await axios.get(`${OS_NOVA_URL}/os-keypairs/${KEYPAIR_NAME}`, {
      headers: { 'X-Auth-Token': token }
    });
    console.log(`La paire de clés "${KEYPAIR_NAME}" existe déjà.`);
    return; // Rien à faire, la clé existe déjà
  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.log(`La paire de clés "${KEYPAIR_NAME}" n'existe pas, création en cours...`);
      // Créer la paire de clés pour générer automatiquement la clé privée
      const createResponse = await axios.post(`${OS_NOVA_URL}/os-keypairs`, {
        keypair: {
          name: KEYPAIR_NAME
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        }
      });
      const privateKey = createResponse.data.keypair.private_key;
      if (privateKey) {
        // Sauvegarder la clé privée dans un fichier avec des permissions sécurisées
        fs.writeFileSync(KEYPAIR_FILE, privateKey, { mode: 0o600 });
        console.log(`La paire de clés "${KEYPAIR_NAME}" a été créée et sauvegardée dans ${KEYPAIR_FILE}.`);
      } else {
        console.warn("La création de la paire de clés n'a pas renvoyé de clé privée.");
      }
    } else {
      // Remonter toute autre erreur
      throw err;
    }
  }
}

// Endpoint pour créer une VM et récupérer ses détails complets
app.get('/create-vm', async (req, res) => {
  try {
    // 1. Authentification via Keystone pour obtenir un token
    const authPayload = {
      auth: {
        identity: {
          methods: ["password"],
          password: {
            user: {
              name: OS_USERNAME,
              domain: { id: OS_DOMAIN_ID },
              password: OS_PASSWORD
            }
          }
        },
        scope: {
          project: {
            name: OS_PROJECT_NAME,
            domain: { id: OS_DOMAIN_ID }
          }
        }
      }
    };

    const authResponse = await axios.post(`${OS_IDENTITY_URL}/auth/tokens`, authPayload, {
      headers: { 'Content-Type': 'application/json' }
    });
    // Récupérer le token depuis l'en-tête X-Subject-Token
    const token = authResponse.headers['x-subject-token'];
    console.log('Token obtenu:', token);

    // 2. Vérifier/créer la paire de clés si nécessaire
    await ensureKeypairExists(token);

    // 3. Créer la VM via l'API Nova
    const serverPayload = {
      server: {
        name: "myVM",
        // ID de l'image Cirros (vérifiez avec "openstack image list")
        imageRef: "33ab88eb-b0b6-4de7-a0f3-95fd927df966",
        // ID du flavor (vérifiez avec "openstack flavor list"; ici "1" doit être remplacé si nécessaire)
        flavorRef: "1",
        // ID du réseau auquel connecter la VM (vérifiez avec "openstack network list")
        networks: [{ uuid: "8d310f7c-15c4-427d-abba-821df668cc4a" }],
        key_name: KEYPAIR_NAME
      }
    };

    const novaResponse = await axios.post(`${OS_NOVA_URL}/servers`, serverPayload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': token
      }
    });

    console.log('Réponse Nova (création):', novaResponse.data);
    const serverId = novaResponse.data.server.id;

    // 4. Récupérer les détails complets de la VM créée
    const serverDetailsResponse = await axios.get(`${OS_NOVA_URL}/servers/${serverId}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': token
      }
    });
    console.log('Détails de la machine:', serverDetailsResponse.data);

    res.status(200).json({
      message: "Instance créée avec succès",
      data: [serverDetailsResponse.data.server]
    });
  } catch (error) {
    console.error('Erreur lors de la création de la VM:', error.response ? error.response.data : error.message);
    res.status(500).json({
      message: "Erreur lors de la création de la VM",
      error: error.response ? error.response.data : error.message
    });
  }
});

module.exports = router;
