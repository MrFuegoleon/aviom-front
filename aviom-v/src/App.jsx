import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/loginForm";
import Home from "./pages/home";
import Serveur from "./pages/services.jsx";
import Dashboard from "./pages/dashboard";
import Facturation from "./pages/facturation";
import Commande from "./pages/commande";
import Support from "./pages/support";
import Informations from "./pages/informations";
import ConfirmationPaiement from "./pages/ConfirmationPaiement";
import OpenMachine from "./pages/Machine";
import Manage from "./pages/doubleButton.jsx";
import Sidebar from "./components/Sidebar/sidebar.jsx";
import CreateProject from "./pages/CreateProject.jsx";
import ProtectedPage from "./components/protectedPage.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route for Login */}
        <Route path="/login" element={<LoginForm />} />

        {/* Protected Routes */}
        <Route element={<ProtectedPage />}>
          <Route
            path="/"
            element={
              <div className="app-container">
                <Sidebar />
                <main className="main-content">
                  <Dashboard />
                </main>
              </div>
            }
          />
          <Route
            path="/services"
            element={
              <div className="app-container">
                <Sidebar />
                <main className="main-content">
                  <Serveur />
                </main>
              </div>
            }
          />
          <Route
            path="/facturation"
            element={
              <div className="app-container">
                <Sidebar />
                <main className="main-content">
                  <Facturation />
                </main>
              </div>
            }
          />
          <Route
            path="/commande"
            element={
              <div className="app-container">
                <Sidebar />
                <main className="main-content">
                  <Commande />
                </main>
              </div>
            }
          />
          <Route
            path="/informations"
            element={
              <div className="app-container">
                <Sidebar />
                <main className="main-content">
                  <Informations />
                </main>
              </div>
            }
          />
          <Route
            path="/support"
            element={
              <div className="app-container">
                <Sidebar />
                <main className="main-content">
                  <Support />
                </main>
              </div>
            }
          />
          <Route
            path="/confirmation-paiement"
            element={
              <div className="app-container">
                <Sidebar />
                <main className="main-content">
                  <ConfirmationPaiement />
                </main>
              </div>
            }
          />
          <Route
            path="/manage"
            element={
              <div className="app-container">
                <Sidebar />
                <main className="main-content">
                  <Manage />
                </main>
              </div>
            }
          />
          <Route
            path="/createProject"
            element={
              <div className="app-container">
                <Sidebar />
                <main className="main-content">
                  <CreateProject />
                </main>
              </div>
            }
          />
          <Route
            path="/machine"
            element={
              <div className="app-container">
                <Sidebar />
                <main className="main-content">
                  <OpenMachine />
                </main>
              </div>
            }
          />
        </Route>

        {/* Redirect all other paths to the root */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;


         {/* <Route path="/" element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <Home />
              </main>
            </div>
          } />*/}