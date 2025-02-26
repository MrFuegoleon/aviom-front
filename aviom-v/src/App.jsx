import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/loginForm";
import Home from "./pages/home";
import Services from "./pages/serveur";
import Dashboard from "./pages/dashboard";
import Facturation from "./pages/facturation";
import Commande from "./pages/commande";
import Support from "./pages/support";
import Informations from "./pages/informations";
import ConfirmationPaiement from "./pages/ConfirmationPaiement";
import OpenMachine from "./pages/Machine";
import PrivateRoute from "./PrivateRoute"; 
import Sidebar from "./components/Sidebar/sidebar.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/" element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <Home />
              </main>
            </div>
          } />
          <Route path="/services" element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <OpenMachine />
              </main>
            </div>
          } />
          <Route path="/dashboard" element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <Dashboard />
              </main>
            </div>
          } />
          <Route path="/facturation" element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <Facturation />
              </main>
            </div>
          } />
          <Route path="/commande" element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <Commande />
              </main>
            </div>
          } />
          <Route path="/informations" element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <Informations />
              </main>
            </div>
          } />
          <Route path="/support" element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <Support />
              </main>
            </div>
          } />
          <Route path="/confirmation-paiement" element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <ConfirmationPaiement />
              </main>
            </div>
          } />
          <Route path="/machine" element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <OpenMachine />
              </main>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
