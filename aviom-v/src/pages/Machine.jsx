import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../axiosConfig';

const API_BASE = '/api/openstack';

function OpenMachine() {
  const [vms, setVms] = useState([]);
  const [flavors, setFlavors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showResize, setShowResize] = useState(false);
  const [showConfirmResize, setShowConfirmResize] = useState(false);
  const [vmName, setVmName] = useState('');
  const [selectedVm, setSelectedVm] = useState(null);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [resizeStatus, setResizeStatus] = useState(null);
  const [activeActions, setActiveActions] = useState({});

  useEffect(() => {
    fetchVms();
    fetchFlavors();
  }, []);

  

  const fetchVms = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`${API_BASE}/list-vms`);
      setVms(data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement des VMs');
    } finally {
      setLoading(false);
    }
  };

  const fetchFlavors = async () => {
    try {
      const { data } = await api.get(`${API_BASE}/flavors`);
      setFlavors(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement des flavors');
    }
  };

  const handleCreateVm = async () => {
    if (!selectedFlavor) {
      setError("Veuillez sélectionner un flavor !");
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
      setError(err.response?.data?.message || 'Erreur de création');
    } finally {
      setLoading(false);
    }
  };

  const handleResize = async () => {
    try {
      setLoading(true);
      const flavor = flavors.find(f => f.id === selectedFlavor);
      if (!flavor) throw new Error("Flavor introuvable");

      await api.put(`${API_BASE}/resize-vm/${selectedVm.id}`, {
        ram: flavor.ram,
        vcpus: flavor.vcpus,
        disk: flavor.disk
      });

      setResizeStatus({ status: 'PENDING', vmId: selectedVm.id });
      setShowConfirmResize(true);
      setShowResize(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de redimensionnement');
    } finally {
      setLoading(false);
    }
  };

  const handleVmAction = async (action, vmId, data) => {
    try {
      setActiveActions(prev => ({ ...prev, [vmId]: true }));
      const endpoint = action === 'delete' ? api.delete : api.post;
      await endpoint(`${API_BASE}/${action}-vm/${vmId}`, data);
      await fetchVms();
    } catch (err) {
      setError(err.response?.data?.message || `Erreur ${action}`);
    } finally {
      setActiveActions(prev => ({ ...prev, [vmId]: false }));
    }
  };

  return (
    <div>
        <div className="container mt-4">
          <h1 className="mb-4">Gestion des VMs OpenStack</h1>

          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

          <div className="mb-3">
            <Button variant="primary" onClick={() => setShowCreate(true)} disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : 'Créer une VM'}
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
                  <th>Nom</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vms.map(vm => (
                  <tr key={vm.id}>
                    <td>{vm.id}</td>
                    <td>{vm.name}</td>
                    <td>{vm.status}</td>
                    <td>
                      <Button 
                        variant="success" 
                        className="me-2"
                        onClick={() => handleVmAction('start', vm.id)}
                        disabled={vm.status === 'ACTIVE' || activeActions[vm.id]}
                      >
                        {activeActions[vm.id] ? <Spinner size="sm" animation="border" /> : 'Démarrer'}
                      </Button>
                      <Button 
                        variant="warning" 
                        className="me-2"
                        onClick={() => handleVmAction('stop', vm.id)}
                        disabled={vm.status !== 'ACTIVE' || activeActions[vm.id]}
                      >
                        {activeActions[vm.id] ? <Spinner size="sm" animation="border" /> : 'Arrêter'}
                      </Button>
                      <Button 
                        variant="secondary" 
                        className="me-2"
                        onClick={() => {
                          const type = window.confirm("Forcer le redémarrage (HARD) ?") ? "HARD" : "SOFT";
                          handleVmAction('reboot', vm.id, { type });
                        }}
                        disabled={vm.status !== 'ACTIVE' || activeActions[vm.id]}
                      >
                        {activeActions[vm.id] ? <Spinner size="sm" animation="border" /> : 'Redémarrer'}
                      </Button>
                      <Button 
                        variant="info" 
                        className="me-2"
                        onClick={() => {
                          setSelectedVm(vm);
                          setShowResize(true);
                        }}
                        disabled={activeActions[vm.id]}
                      >
                        Redimensionner
                      </Button>
                      <Button 
                        variant="danger"
                        onClick={() => handleVmAction('delete', vm.id)}
                        disabled={activeActions[vm.id]}
                      >
                        {activeActions[vm.id] ? <Spinner size="sm" animation="border" /> : 'Supprimer'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Modal de création */}
          <Modal show={showCreate} onHide={() => setShowCreate(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Créer une VM</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Nom de la VM</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={vmName}
                    onChange={(e) => setVmName(e.target.value)}
                    placeholder="Entrez un nom pour la VM"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Choisir un flavor</Form.Label>
                  <Form.Select 
                    value={selectedFlavor}
                    onChange={(e) => setSelectedFlavor(e.target.value)}
                  >
                    <option value="">Sélectionner un flavor</option>
                    {flavors.map(flavor => (
                      <option key={flavor.id} value={flavor.id}>
                        {flavor.name} - {flavor.vcpus} vCPUs, {flavor.ram}MB RAM, {flavor.disk}GB Disk
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowCreate(false)}>
                Annuler
              </Button>
              <Button variant="primary" onClick={handleCreateVm} disabled={!selectedFlavor}>
                Créer
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal de redimensionnement */}
          <Modal show={showResize} onHide={() => setShowResize(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Redimensionner {selectedVm?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Choisir un nouveau flavor</Form.Label>
                  <Form.Select 
                    value={selectedFlavor}
                    onChange={(e) => setSelectedFlavor(e.target.value)}
                  >
                    <option value="">Sélectionner un flavor</option>
                    {flavors.map(flavor => (
                      <option key={flavor.id} value={flavor.id}>
                        {flavor.name} - {flavor.vcpus} vCPUs, {flavor.ram}MB RAM, {flavor.disk}GB Disk
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowResize(false)}>
                Annuler
              </Button>
              <Button variant="primary" onClick={handleResize} disabled={!selectedFlavor}>
                Redimensionner
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal de confirmation de redimensionnement */}
          <Modal show={showConfirmResize} onHide={() => setShowConfirmResize(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmer le redimensionnement</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Le redimensionnement est en attente de confirmation</p>
              <p>Que souhaitez-vous faire ?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={async () => {
                await api.post(`${API_BASE}/revert-resize/${resizeStatus.vmId}`);
                setShowConfirmResize(false);
                await fetchVms();
              }}>
                Annuler
              </Button>
              <Button variant="success" onClick={async () => {
                await api.post(`${API_BASE}/confirm-resize/${resizeStatus.vmId}`);
                setShowConfirmResize(false);
                await fetchVms();
              }}>
                Confirmer
              </Button>
            </Modal.Footer>
          </Modal>

          
        </div>
        </div>
    
      );
    }

export default OpenMachine;

