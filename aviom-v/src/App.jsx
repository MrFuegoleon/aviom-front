import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./pages/home";
import Services from "./pages/serveur";
import  Dashboard from "./pages/dashboard";
import Facturation from "./pages/facturation";
import Commande from "./pages/commande";
import Support from "./pages/support";
import Informations from "./pages/informations"; // Assurez-vous d'importer le composant
import './App.css'
import ConfirmationPaiement from "./pages/ConfirmationPaiement";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <Sidebar />

        {/* Contenu Dynamique */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/facturation" element={<Facturation />} />
            <Route path="/commande" element={<Commande />} />
            <Route path="/informations" element={<Informations />} /> {/* Correction du chemin */}
            <Route path="/support" element={<Support />} />
            <Route path="/confirmation-paiement" element={<ConfirmationPaiement />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
