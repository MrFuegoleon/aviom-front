import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";

const CancelSubscriptionButton = ({ refreshUser }) => {
  const navigate = useNavigate();

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel your subscription? This will remove all packs and deactivate your project.")) {
      try {
        const { data } = await api.post("/api/cancel-subscription");
        alert(data.message);
        if (refreshUser) {
          refreshUser();
        }
        navigate("/services");
      } catch (err) {
        console.error("Error canceling subscription:", err);
        alert("Error canceling subscription.");
      }
    }
  };

  return (
    <Button variant="danger" onClick={handleCancel}>
    Annuler l'abonnement    
    </Button>
  );
};

export default CancelSubscriptionButton;
