import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../axiosConfig';
import { useNavigate } from "react-router-dom";
import VmRow from '../components/VmRow'
const API_BASE = '/api/openstack';

function OpenMachine() {
  const [vms, setVms] = useState([]);
  const [flavors, setFlavors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [vmName, setVmName] = useState('');
  const [selectedVm, setSelectedVm] = useState(null);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [activeActions, setActiveActions] = useState({});
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
          // Show a popup before redirecting
          const shouldRedirect = window.confirm(
            "You don't have any pack. Would you like to go to the Services page to purchase one?"
          );
          if (shouldRedirect) {
            navigate("/createProject");
          } else {
            navigate("/dashboard");
          }
        }
      })
      .catch(error => {
        console.error("Error fetching user profile:", error);
      });
    fetchVms();
    fetchFlavors();
  }, []);

  useEffect(() => {
    fetchVms();
    fetchFlavors();
  }, []);
  
  

  const fetchVms = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`${API_BASE}/list-vms`);
      setVms(data.data);
      console.log(data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading VMs');
    } finally {
      setLoading(false);
    }
  };

  const fetchFlavors = async () => {
    try {
      const { data } = await api.get(`${API_BASE}/flavors`);
      setFlavors(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading flavors');
    }
  };

  const handleCreateVm = async () => {
    if (!selectedFlavor) {
      setError("Please select a flavor!");
      return;
    }

    try {
      setLoading(true);
      await api.post(`${API_BASE}/create-vm`, { 
        flavorRef: selectedFlavor, 
        name: vmName || "VM-User" 
      });
      await fetchVms();
      setShowCreate(false);
      setVmName('');
      setSelectedFlavor('');
    } catch (err) {
      setError(err.response?.data?.message || 'Creation error');
    } finally {
      setLoading(false);
    }
  };

  const handleVmAction = async (action, vmId, data) => {
    try {
      // Mark action as active for this VM so that the spinner shows.
      setActiveActions(prev => ({ ...prev, [vmId]: true }));
  
      // Get the initial status from your local state (fetched via fetchVms)
      const initialVm = vms.find(vm => vm.id === vmId);
      const initialStatus = initialVm ? initialVm.status : null;
  
      // Trigger the action (start, stop, reboot, etc.)
      const endpoint = action === 'delete' ? api.delete : api.post;
      await endpoint(`${API_BASE}/${action}-vm/${vmId}`, data);
  
      // Start polling for status change every 3 seconds.
      let attempts = 0;
      const maxAttempts = 20; // For example, wait up to 60 seconds.
      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          // Fetch the updated status of the VM.
          // Adjust this endpoint if necessary.
          const { data: vmData } = await api.get(`${API_BASE}/servers/${vmId}`);
          // If your API returns the VM details inside "server":
          const updatedStatus = vmData.server ? vmData.server.status : vmData.status;
          
          // If the status has changed from the initial status, clear the spinner.
          if (updatedStatus && updatedStatus !== initialStatus) {
            clearInterval(pollInterval);
            setActiveActions(prev => ({ ...prev, [vmId]: false }));
          } else if (attempts >= maxAttempts) {
            // If max attempts reached, clear the spinner to avoid an infinite spinner.
            clearInterval(pollInterval);
            setActiveActions(prev => ({ ...prev, [vmId]: false }));
          }
        } catch (pollErr) {
          console.error("Polling error:", pollErr);
        }
      }, 3000); // Poll every 3 seconds.
    } catch (err) {
      setError(err.response?.data?.message || `Error during ${action}`);
      setActiveActions(prev => ({ ...prev, [vmId]: false }));
    }
  };
  


  return (
    <div className="container mt-4">
      <h1 className="mb-4">OpenStack VM Management</h1>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <div className="mb-3">
        <Button variant="primary" onClick={() => setShowCreate(true)} disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : 'Create VM'}
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vms.map(vm => (
              <VmRow 
                key={vm.id}
                vm={vm}
                handleVmAction={handleVmAction}
                activeAction={activeActions[vm.id]}
              />
            ))}
          </tbody>
        </Table>
      )}

      {/* Create VM Modal */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create VM</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>VM Name</Form.Label>
              <Form.Control 
                type="text" 
                value={vmName}
                onChange={(e) => setVmName(e.target.value)}
                placeholder="Enter a VM name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Select a Flavor</Form.Label>
              <Form.Select 
                value={selectedFlavor}
                onChange={(e) => setSelectedFlavor(e.target.value)}
              >
                <option value="">Select a flavor</option>
                {flavors.map(flavor => (
                  <option key={flavor.id} value={flavor.id}>
                    {flavor.name} - {flavor.vcpus} vCPUs, {flavor.ram} MB RAM, {flavor.disk} GB Disk
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreate(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateVm} disabled={!selectedFlavor}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default OpenMachine;
