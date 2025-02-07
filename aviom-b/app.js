const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuration OpenStack (à adapter et sécuriser)
const OS_IDENTITY_URL = 'http://192.168.43.137/identity/v3';
const OS_USERNAME = 'admin';
const OS_PASSWORD = 'aviom2025';
const OS_PROJECT_NAME = 'admin';
const OS_DOMAIN_ID = 'default';

// URL de l'API Nova (vérifiez que l'IP correspond à celle accessible en mode pont)
const OS_NOVA_URL = 'http://192.168.43.137/compute/v2.1';

// Nom de la paire de clés à utiliser/créer
const KEYPAIR_NAME = 'mykey';
// Chemin pour sauvegarder la clé privée (si création de la paire)
const KEYPAIR_FILE = 'mykey.pem';

app.get('/', async (req, res) => {
  res.send('Backend Express pour OpenStack est en marche.');
});

// Fonction pour vérifier si la paire de clés existe
async function ensureKeypairExists(token) {
  try {
    // Essayer de récupérer la paire de clés
    const getResponse = await axios.get(`${OS_NOVA_URL}/os-keypairs/${KEYPAIR_NAME}`, {
      headers: { 'X-Auth-Token': token }
    });
    console.log(`La paire de clés "${KEYPAIR_NAME}" existe déjà.`);
    return; // Rien à faire, la clé existe déjà
  } catch (err) {
    // Si le status est 404, la paire n'existe pas
    if (err.response && err.response.status === 404) {
      console.log(`La paire de clés "${KEYPAIR_NAME}" n'existe pas, création en cours...`);
      // Créer la paire de clés sans fournir de clé publique pour générer automatiquement la paire
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
        // Sauvegarder la clé privée dans un fichier
        fs.writeFileSync(KEYPAIR_FILE, privateKey, { mode: 0o600 });
        console.log(`La paire de clés "${KEYPAIR_NAME}" a été créée et sauvegardée dans ${KEYPAIR_FILE}.`);
      } else {
        console.warn("La création de la paire de clés ne renvoie pas de clé privée.");
      }
    } else {
      // Autre erreur
      throw err;
    }
  }
}

// Endpoint pour créer une VM et récupérer ses détails complets
app.post('/create-vm', async (req, res) => {
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
        // ID de l'image Cirros
        imageRef: "1ac7449d-60b0-47df-b614-63cf9a361e55",
        // Utilisez l'ID réel du flavor pour m1.tiny (remplacez ici par l'ID correct ou conservez "1" si c'est le bon)
        flavorRef: "1",
        // Remplacez <ID_du_réseau> par l'ID réel de votre réseau (obtenu via openstack network list)
        networks: [{ uuid: "32c86b94-167a-440f-887e-a9e374e36cae" }],
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
    // Récupérer l'ID de la VM créée
    const serverId = novaResponse.data.server.id;

    // 4. Récupérer les détails complets de la machine créée
    const serverDetailsResponse = await axios.get(`${OS_NOVA_URL}/servers/${serverId}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': token
      }
    });
    console.log('Détails de la machine:', serverDetailsResponse.data);

    // Renvoyer au front-end le message et les détails complets de la machine
    res.status(200).json({
      message: "Instance créée avec succès",
      data: [ serverDetailsResponse.data.server ]

    });
  } catch (error) {
    console.error('Erreur lors de la création de la VM:', error.response ? error.response.data : error.message);
    res.status(500).json({
      message: "Erreur lors de la création de la VM",
      error: error.response ? error.response.data : error.message
    });
  }
});

// Lancer le serveur Express sur le port 3000
app.listen(3000, () => {
  console.log('Serveur Express démarré sur le port 3000');
});
