// src/hooks/useVmStatusSse.js
import { useState, useEffect } from "react";

const useVmStatusSse = (vmId) => {
  const [status, setStatus] = useState("unknown");

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Construct the SSE URL (here token is passed as a query param)
    const sseUrl = `http://localhost:5000/api/sse/vm-status?vmId=${vmId}&token=${token}`;
    console.log("Connecting to SSE at:", sseUrl);
    
    const eventSource = new EventSource(sseUrl);

    eventSource.onopen = () => {
      console.log("SSE connection opened for vmId", vmId);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.status) {
          setStatus(data.status);
        }
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error for vmId", vmId, err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [vmId]);

  return status;
};

export default useVmStatusSse;
