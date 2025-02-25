/*
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'youruser',
  password: process.env.DB_PASSWORD || 'yourpassword',
  database: process.env.DB_NAME || 'yourdatabase',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function findUserByUsername(username) {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
}
*/

const users = [
  {
    id: 1,
    username: 'user',
    // Hash généré pour "password"
    password: 'password'
  },
  {
    id: 2,
    username: 'admin',
    // Hash généré pour "admin123"
    password: 'admin'
  }
];

async function findUserByUsername(username) {
  // Simule une recherche dans une base de données en retournant la promesse résolue
  return users.find(u => u.username === username);
}
module.exports = { findUserByUsername };
