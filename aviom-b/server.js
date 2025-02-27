const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { keycloak, memoryStore } = require("./keycloak-config");
const session = require("express-session");
require("dotenv").config();
const bodyParser = require('body-parser');
const passport = require('./passport-config');
const authenticateJWT = require('./middlewares/authenticateJWT.js'); // Chemin vers votre middleware


const openstackRoutes = require('./routes/openstack.js');
const gocardlessRoutes = require('./routes/gocardless.js');
const paypalRoutes = require('./routes/paypal.js');
const exchangeTokenRoutes = require('./routes/exchangeToken.js');
const logoutRoutes = require('./routes/logout');
const authRoutes = require('./routes/login');
const protectedRoutes = require('./routes/protected');
const sseRoutes = require('./routes/sse.js');



const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(passport.initialize());


app.use(session({
  secret: process.env.SESSION_SECRET || "some-secret-key",
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

app.use('/api/auth', authRoutes);
app.use("/api/sse", sseRoutes);
app.use('/api/protected', protectedRoutes);
app.use("/api/openstack", openstackRoutes);
app.use("/api/gocardless", gocardlessRoutes);
app.use("/api/paypal", paypalRoutes);
app.use("/api/exchange-token", exchangeTokenRoutes);
app.use("/api/logout", logoutRoutes);


app.get('/', async (req, res) => {
  res.send('Backend Express pour OpenStack est en marche.');
});



app.listen(5000, () => {
  console.log("✅  port 5000");
});
