import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from '../axiosConfig';


const Manage = () => {
  const [userPacks, setUserPacks] = useState({ eco: 0, duo: 0, trio: 0, flex: 0 });
  const [hasPack, setHasPack] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile data from the backend.
    api.get("/api/machine")
      .then(response => {
        const { eco, duo, trio, flex } = response.data;
        console.log("Response from /api/machine:", response.data);

        setUserPacks({ eco, duo, trio, flex });
        // Determine if the user has any pack
        if (eco === 1 || duo === 1 || trio === 1 || flex === 1) {
          setHasPack(true);
        } else {
          setHasPack(false);
        }
      })
      .catch(error => {
        console.error("Error fetching user profile:", error);
      });
  }, []);

  return (
    <div>
      <Button variant="primary" onClick={() => navigate("/services")}>
        Packs
      </Button>
      <Button 
        variant="secondary" 
        onClick={() => navigate("/machine")} 
        disabled={!hasPack}
      >
        Manage Machine
      </Button>
    </div>
  );
};

export default Manage;
