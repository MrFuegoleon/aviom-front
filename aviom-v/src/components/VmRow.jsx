import React, { useState, useEffect } from "react";
import { Button, Spinner, Modal, Form } from "react-bootstrap";
import useVmStatusSse from "../hooks/useVmStatusSse";
import api from "../axiosConfig";
const API_BASE = '/api/openstack';

const VmRow = ({ vm, handleVmAction, activeAction }) => {
  const [showResize, setShowResize] = useState(false);
  const [showConfirmResize, setShowConfirmResize] = useState(false);
  const [resizeStatus, setResizeStatus] = useState(null);
  const [selectedVm, setSelectedVm] = useState(null);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [flavors, setFlavors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Listen for dynamic status updates via SSE
  const sseStatus = useVmStatusSse(vm.id);
  const currentStatus = sseStatus !== "unknown" ? sseStatus : vm.status;

  // Refresh flavors on mount
  useEffect(() => {
    const fetchFlavors = async () => {
      try {
        const { data } = await api.get(`${API_BASE}/flavors`);
        setFlavors(data.data);
      } catch (err) {
        console.error("Error fetching flavors:", err);
      }
    };
    fetchFlavors();
  }, []);

  useEffect(() => {
    if (currentStatus === 'DELETED') {
      // When status becomes 'DELETED', refresh the VM list
      window.location.reload();
    }
  }, [currentStatus]);

  // Handle VM resize action
  const handleResize = async () => {
    try {
      setLoading(true);
      const flavor = flavors.find(f => f.id === selectedFlavor);
      if (!flavor) throw new Error("Flavor not found");

      await api.put(`${API_BASE}/resize-vm/${selectedVm.id}`, {
        ram: flavor.ram,
        vcpus: flavor.vcpus,
        disk: flavor.disk
      });

      setResizeStatus({ status: 'PENDING', vmId: selectedVm.id });
      setShowConfirmResize(true);
      setShowResize(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Resize error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <tr>
        <td>{vm.id}</td>
        <td>{vm.name}</td>
        <td>{currentStatus}</td>
        <td>
          <Button 
            variant="success" 
            className="me-2"
            onClick={() => handleVmAction('start', vm.id)}
            disabled={currentStatus === 'ACTIVE' || activeAction}
          >
            {activeAction ? <Spinner size="sm" animation="border" /> : 'Start'}
          </Button>
          <Button 
            variant="warning" 
            className="me-2"
            onClick={() => handleVmAction('stop', vm.id)}
            disabled={currentStatus !== 'ACTIVE' || activeAction}
          >
            {activeAction ? <Spinner size="sm" animation="border" /> : 'Stop'}
          </Button>
          <Button 
            variant="secondary" 
            className="me-2"
            onClick={() => {
              const type = window.confirm("Force reboot (HARD) ?") ? "HARD" : "SOFT";
              handleVmAction('reboot', vm.id, { type });
            }}
            disabled={currentStatus !== 'ACTIVE' || activeAction}
          >
            {activeAction ? <Spinner size="sm" animation="border" /> : 'Reboot'}
          </Button>
          <Button 
            variant="info" 
            className="me-2"
            onClick={() => {
              setSelectedVm(vm);
              setShowResize(true);
            }}
            disabled={activeAction}
          >
            {activeAction ? <Spinner size="sm" animation="border" /> : 'Resize'}
          </Button>
          <Button 
            variant="danger"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this VM? This action cannot be undone.")) {
                handleVmAction('delete', vm.id);
              }
            }}
            disabled={activeAction}
          >
            {activeAction ? <Spinner size="sm" animation="border" /> : 'Delete'}
          </Button>
        </td>
      </tr>

      {/* Resize VM Modal */}
      <Modal show={showResize} onHide={() => setShowResize(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Resize {selectedVm?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select a new flavor</Form.Label>
              <Form.Select 
                value={selectedFlavor}
                onChange={(e) => setSelectedFlavor(e.target.value)}
              >
                <option value="">Select a flavor</option>
                {flavors
                  .filter(flavor => flavor.id !== vm.flavor.id) // Exclude current flavor
                  .map(flavor => (
                    <option key={flavor.id} value={flavor.id}>
                      {flavor.name} - {flavor.vcpus} vCPUs, {flavor.ram} MB RAM, {flavor.disk} GB Disk
                    </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResize(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleResize} disabled={!selectedFlavor}>
            Resize
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Resize Modal */}
      {currentStatus === 'VERIFY_RESIZE' && (
        <Modal show={showConfirmResize} onHide={() => setShowConfirmResize(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Resize</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>The resize is pending confirmation. What would you like to do?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={async () => {
              await api.post(`${API_BASE}/revert-resize/${resizeStatus.vmId}`);
              setShowConfirmResize(false);
            }}>
              Cancel
            </Button>
            <Button variant="success" onClick={async () => {
              await api.post(`${API_BASE}/confirm-resize/${resizeStatus.vmId}`);
              setShowConfirmResize(false);
            }}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default VmRow;
