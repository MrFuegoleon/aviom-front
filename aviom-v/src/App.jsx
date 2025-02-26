import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import { useAuth, AuthProvider } from "./hooks/useAuth";
import Home from "./pages/home";
<<<<<<< HEAD
import Services from "./pages/services";
import Dashboard from "./pages/dashboard";
=======
import Services from "./pages/serveur";
import  Dashboard from "./pages/dashboard";
>>>>>>> f725de35e652d67cc5aa0e76829753486e5e6814
import Facturation from "./pages/facturation";
import Commande from "./pages/commande";
import Support from "./pages/support";
import Informations from "./pages/informations";
import ConfirmationPaiement from "./pages/ConfirmationPaiement";
import Callback from "./pages/Callback"; // Gestion du retour Keycloak
import "./App.css";

const loginWithKeycloak = () => {
  const keycloakURL = `http://localhost:8080/auth/realms/Aviom/protocol/openid-connect/auth` +
    `?client_id=myclient` +
    `&redirect_uri=${encodeURIComponent(window.location.origin + "/callback")}` +
    `&response_type=code` +
    `&scope=openid`;

  console.log("🔄 Redirection vers Keycloak:", keycloakURL);
  window.location.href = keycloakURL;
};



// 📌 Route protégée
const ProtectedRoute = ({ element }) => {
  const { token } = useAuth();
  console.log("🔍 [App] Vérification de `useAuth()`, token:", token);
  return token ? element : loginWithKeycloak(); // 🔄 Redirige directement vers Keycloak
};

// 📌 Vérifie si l'utilisateur est connecté, sinon il le redirige vers Keycloak
const AuthWrapper = ({ children }) => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      console.log("🚨 [AuthWrapper] Aucun token, redirection vers Keycloak");
      loginWithKeycloak();
    }
  }, [token, navigate]);

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AuthWrapper> {/* Redirection automatique vers Keycloak */}
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="/callback" element={<Callback />} /> {/* Retour Keycloak */}
                <Route path="/" element={<ProtectedRoute element={<Home />} />} />
                <Route path="/services" element={<ProtectedRoute element={<Services />} />} />
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                <Route path="/facturation" element={<ProtectedRoute element={<Facturation />} />} />
                <Route path="/commande" element={<ProtectedRoute element={<Commande />} />} />
                <Route path="/informations" element={<ProtectedRoute element={<Informations />} />} />
                <Route path="/support" element={<ProtectedRoute element={<Support />} />} />
                <Route path="/confirmation-paiement" element={<ProtectedRoute element={<ConfirmationPaiement />} />} />
                <Route path="*" element={<Navigate to="/" />} /> {/* Redirection automatique */}
              </Routes>
            </main>
          </div>
        </AuthWrapper>
      </Router>
    </AuthProvider>
  );
};

export default App;
