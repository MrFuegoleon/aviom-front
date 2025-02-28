import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
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
  const [success, setSuccess] = useState("");
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
  
      let response;
      if (userProjectId) {
        // Call the update route since a project already exists.
        response = await api.post("/api/update-project",payload);
      } else {
        // Call the create route because no project exists yet.
        response = await api.post("/api/create-project", payload);
        // Optionally, store the new projectId in local storage for future use.
        localStorage.setItem("projectId", response.data.projectId);
      }
      
      setSuccess(`Project processed successfully! Project ID: ${response.data.projectId}`);
      setError("");
      navigate("/machine");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error processing project");
      setSuccess("");
    }
  };
  
  

  return (
    <div className="container mt-4">
      <h2>Create a New Project</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
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
    </div>
  );
};

export default CreateProject;
