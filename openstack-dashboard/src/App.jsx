// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/loginForm"
import OpenMachine from "./pages/Machine";
import PrivateRoute from "./PrivateRoute";
function App() {
  return (
    <Router>
      <Routes>
        {/* Route publique pour la connexion */}
        <Route path="/login" element={<LoginForm />} />

        {/* Routes protégées */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<OpenMachine />} />
          {/* Vous pouvez ajouter d'autres routes protégées ici */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
