const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();
const { findUserByUsername, pool } = require('../db');
const authenticateJWT = require("../middlewares/authenticateJWT");

const OS_IDENTITY_URL = process.env.OS_IDENTITY_URL;
const OS_USERNAME = process.env.OS_USERNAME;
const OS_PASSWORD = process.env.OS_PASSWORD;
const OS_DOMAIN_ID = process.env.OS_DOMAIN_ID;
const OS_NOVA_URL = process.env.OS_NOVA_URL;
const KEYPAIR_NAME = process.env.KEYPAIR_NAME;
const KEYPAIR_FILE = process.env.KEYPAIR_FILE;

const OS_PROJECT_ID = process.env.OS_PROJECT_ID || "88b62020c9c946f4ab54d8d48f1bb470";

router.post('/create-project', authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const { name, description, allocatedResources, pack } = req.body;

  try {
    // Step 1: Obtain a Keystone token using admin credentials
    const authPayload = {
      auth: {
        identity: {
          methods: ["password"],
          password: {
            user: {
              name: process.env.OS_USERNAME,
              domain: { id: process.env.OS_DOMAIN_ID },
              password: process.env.OS_PASSWORD,
            },
          },
        },
        scope: {
          project: {
            name: process.env.OS_PROJECT_NAME,
            domain: { id: process.env.OS_DOMAIN_ID },
          },
        },
      },
    };

    const authResponse = await axios.post(
      `${process.env.OS_IDENTITY_URL}/auth/tokens`,
      authPayload,
      { headers: { "Content-Type": "application/json" } }
    );
    const keystoneToken = authResponse.headers["x-subject-token"];
    if (!keystoneToken) {
      return res.status(401).json({ error: "Failed to get Keystone token" });
    }

    // Step 2: Create a new project in Keystone
    const projectPayload = {
      project: {
        name: name,
        description: description,
        enabled: true,
      },
    };

    const createResponse = await axios.post(
      `${process.env.OS_IDENTITY_URL}/projects`,
      projectPayload,
      {
        headers: {
          "X-Auth-Token": keystoneToken,
          "Content-Type": "application/json",
        },
      }
    );

    const projectId = createResponse.data.project.id;
    if (!projectId) {
      return res.status(500).json({ error: "Project creation failed" });
    }

    // Step 3: Assign the admin role to the user for the new project
    // First, get the admin role ID
    const rolesResponse = await axios.get(
      `${process.env.OS_IDENTITY_URL}/roles`,
      {
        headers: {
          "X-Auth-Token": keystoneToken,
          "Content-Type": "application/json",
        },
      }
    );

    const adminRole = rolesResponse.data.roles.find((role) => role.name === "admin");
    if (!adminRole) {
      return res.status(500).json({ error: "Admin role not found" });
    }

    const adminRoleId = adminRole.id;

    // Assign the admin role to the user for the new project
    await axios.put(
      `${process.env.OS_IDENTITY_URL}/projects/${projectId}/users/${userId}/roles/${adminRoleId}`,
      null,
      {
        headers: {
          "X-Auth-Token": keystoneToken,
          "Content-Type": "application/json",
        },
      }
    );

    // Step 4: Update Nova quota set for the new project
    const quotaPayload = {
      quota_set: {
        ram: allocatedResources.ram, // in MB
        cores: allocatedResources.vcpus, // number of vCPUs
        // ephemeral: allocatedResources.disk // disk quota (optional)
      },
    };

    await axios.put(
      `${process.env.OS_NOVA_URL}/os-quota-sets/${projectId}?force=true`,
      quotaPayload,
      {
        headers: {
          "X-Auth-Token": keystoneToken,
          "Content-Type": "application/json",
        },
      }
    );

    // Step 5: Update the user's record in the database
    let updateQuery = "";
    if (pack === "eco") {
      updateQuery = "UPDATE users SET eco = 1, project_id = ? WHERE id = ?";
    } else if (pack === "duo") {
      updateQuery = "UPDATE users SET duo = 1, project_id = ? WHERE id = ?";
    } else if (pack === "trio") {
      updateQuery = "UPDATE users SET trio = 1, project_id = ? WHERE id = ?";
    } else if (pack === "flex") {
      updateQuery = "UPDATE users SET flex = 1, project_id = ? WHERE id = ?";
    } else {
      updateQuery = "UPDATE users SET project_id = ? WHERE id = ?";
    }
    await pool.query(updateQuery, [projectId, userId]);

    res.status(201).json({ message: "Project created, resources allocated, and admin rights granted", projectId });
  } catch (error) {
    console.error("Error creating project:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// This route requires authentication so that req.user.id is available (or you can send userId in the body)
router.post('/update-project',authenticateJWT, async (req, res) => {
  const userId = req.user.id;

  const { allocatedResources, pack } = req.body;
  try {
    // Get the current project_id for this user from the database
    const [rows] = await pool.query("SELECT project_id FROM users WHERE id = ?", [userId]);
    if (rows.length === 0 || !rows[0].project_id) {
      return res.status(404).json({ error: "User does not have an existing project." });
    }
    const projectId = rows[0].project_id;

    // Obtain a Keystone token using admin credentials (to update quotas)
    const authPayload = {
      auth: {
        identity: {
          methods: ["password"],
          password: {
            user: {
              name: process.env.OS_USERNAME,
              domain: { id: process.env.OS_DOMAIN_ID },
              password: process.env.OS_PASSWORD,
            },
          },
        },
        scope: {
          project: {
            id: projectId
          },
        },
      },
    };

    const authResponse = await axios.post(
      `${process.env.OS_IDENTITY_URL}/auth/tokens`,
      authPayload,
      { headers: { "Content-Type": "application/json" } }
    );
    const keystoneToken = authResponse.headers["x-subject-token"];
    if (!keystoneToken) {
      return res.status(401).json({ error: "Failed to get Keystone token" });
    }

    // Build the quota update payload with the allocated resources.
    const quotaPayload = {
      quota_set: {
        ram: allocatedResources.ram,      // in MB
        cores: allocatedResources.vcpus,    // number of vCPUs
       // ephemeral: allocatedResources.disk       // disk quota (GB, ephemeral storage, etc.)
      }
    };

    // Update the quota set for the existing project in Nova.
    await axios.put(
      `${process.env.OS_NOVA_URL}/os-quota-sets/${projectId}?force=true`,
      quotaPayload,
      {
        headers: {
          "X-Auth-Token": keystoneToken,
          "Content-Type": "application/json",
        },
      }
    );

    // Update the user's record in your database to set the pack flag.
    let updateQuery = "";
    if (pack === "eco") {
      updateQuery = "UPDATE users SET eco = 1 WHERE id = ?";
    } else if (pack === "duo") {
      updateQuery = "UPDATE users SET duo = 1 WHERE id = ?";
    } else if (pack === "trio") {
      updateQuery = "UPDATE users SET trio = 1 WHERE id = ?";
    } else if (pack === "flex") {
      updateQuery = "UPDATE users SET flex = 1 WHERE id = ?";
    } else {
      // If pack type is not recognized, do nothing (or you could choose a default behavior)
      return res.status(400).json({ error: "Invalid pack type" });
    }
    await pool.query(updateQuery, [userId]);

    res.status(200).json({ message: "Project updated and pack set accordingly", projectId });
  } catch (error) {
    console.error("Error updating project:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to update project" });
  }
});


module.exports = router;
