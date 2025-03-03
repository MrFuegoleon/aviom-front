import React, { useState } from 'react';
import { Form, Button, Alert, Modal } from 'react-bootstrap';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ram, setRam] = useState("");
  const [vcpus, setVcpus] = useState("");
  const [disk, setDisk] = useState("");
  const [pack, setPack] = useState("eco");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        description,
        allocatedResources: { ram, vcpus, disk },
        pack,
      };

      // Check if the user already has a project_id by fetching the user profile.
      const userProfileResponse = await api.get("/api/auth");
      const userProjectId = userProfileResponse.data.project_id;

      if (userProjectId) {
        await api.post("/api/project/update-project", payload);
      } else {
        await api.post("/api/project/create-project", payload);
      }

      // Show confirmation pop-up
      setShowModal(true);
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error processing project");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("projectId"); // Remove project ID if stored
    navigate("/login"); // Redirect to login
  };

  return (
    <div className="container mt-4">
      <h2>Create a New Project</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="projectName">
          <Form.Label>Project Name</Form.Label>
          <Form.Control 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </Form.Group>
        <Form.Group controlId="projectDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control 
            type="text" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </Form.Group>
        <Form.Group controlId="ram">
          <Form.Label>RAM (MB)</Form.Label>
          <Form.Control 
            type="number" 
            value={ram} 
            onChange={(e) => setRam(e.target.value)} 
            required 
          />
        </Form.Group>
        <Form.Group controlId="vcpus">
          <Form.Label>vCPUs</Form.Label>
          <Form.Control 
            type="number" 
            value={vcpus} 
            onChange={(e) => setVcpus(e.target.value)} 
            required 
          />
        </Form.Group>
        <Form.Group controlId="disk">
          <Form.Label>Disk (GB)</Form.Label>
          <Form.Control 
            type="number" 
            value={disk} 
            onChange={(e) => setDisk(e.target.value)} 
            required 
          />
        </Form.Group>
        <Form.Group controlId="pack">
          <Form.Label>Select Pack</Form.Label>
          <Form.Select 
            value={pack} 
            onChange={(e) => setPack(e.target.value)}
          >
            <option value="eco">Eco</option>
            <option value="duo">Duo</option>
            <option value="trio">Trio</option>
            <option value="flex">Flex</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Create Project
        </Button>
      </Form>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={handleLogout} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Project Created Successfully</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your project has been successfully created. <br />
          You need to log in again to apply changes.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleLogout}>
            Log In Again
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateProject;
