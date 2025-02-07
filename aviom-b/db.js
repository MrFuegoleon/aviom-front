require('dotenv').config();
const mariadb = require('mariadb');

console.log(" Paramètres de connexion à MariaDB:");
console.log(` Host: ${process.env.DB_HOST}`);
console.log(` Port: ${process.env.DB_PORT}`);
console.log(` User: ${process.env.DB_USER}`);
console.log(` Database: ${process.env.DB_NAME}`);

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 10,  
  acquireTimeout: 60000, 
  idleTimeout: 60000, 
  connectTimeout: 60000,
  waitForConnections: true, 
  charset: 'utf8mb4' 
});


async function testDBConnection() {
  let conn;
  try {
    console.log(" Tentative de connexion à MariaDB...");
    conn = await pool.getConnection();
    console.log(" Connexion réussie à MariaDB !");
  } catch (err) {
    console.error(" Erreur de connexion à MariaDB :", err.message);
  } finally {
    if (conn) {
      conn.release();
      console.log("Connexion libérée.");
    }
  }
}

testDBConnection();

module.exports = pool;
