import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../axiosConfig";

const ProtectedPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        await api.get("/api/auth/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem("token"); // Remove invalid token
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, [token]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show a loading state while verifying token
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedPage;
