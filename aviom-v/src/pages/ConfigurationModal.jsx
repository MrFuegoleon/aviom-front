import React, { useState, useEffect } from 'react';

const ConfigurationModal = ({ configType, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    vmName: '',
    operatingSystem: 'ubuntu',
    cpuRange: getDefaultCpuRange(configType),
    ramRange: getDefaultRamRange(configType),
    ssdRange: getDefaultSsdRange(configType),
    cpu: getDefaultCpu(configType),
    ram: getDefaultRam(configType),
    ssd: getDefaultSsd(configType),
    ipAddresses: getDefaultIpAddresses(configType),
    backup: true,
    firewall: true,
    vlan: configType !== 'eco',
    vpn: configType !== 'eco'
  });

  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  function getDefaultCpuRange(type) {
    switch(type) {
      case 'eco': return { min: 1, max: 2 };
      case 'duo': return { min: 2, max: 5 };
      case 'trio': return { min: 3, max: 7 };
      case 'pro': return { min: 1, max: 16 };
      default: return { min: 1, max: 8 };
    }
  }

  function getDefaultRamRange(type) {
    switch(type) {
      case 'eco': return { min: 1, max: 4 };
      case 'duo': return { min: 2, max: 9 };
      case 'trio': return { min: 4, max: 11 };
      case 'pro': return { min: 1, max: 32 };
      default: return { min: 1, max: 16 };
    }
  }

  function getDefaultSsdRange(type) {
    switch(type) {
      case 'eco': return { min: 10, max: 50 };
      case 'duo': return { min: 20, max: 70 };
      case 'trio': return { min: 50, max: 90 };
      case 'pro': return { min: 10, max: 500 };
      default: return { min: 10, max: 200 };
    }
  }

  function getDefaultCpu(type) {
    switch(type) {
      case 'eco': return 1;
      case 'duo': return 2;
      case 'trio': return 3;
      case 'pro': return 4;
      default: return 2;
    }
  }

  function getDefaultRam(type) {
    switch(type) {
      case 'eco': return 2;
      case 'duo': return 4;
      case 'trio': return 8;
      case 'pro': return 16;
      default: return 4;
    }
  }

  function getDefaultSsd(type) {
    switch(type) {
      case 'eco': return 10;
      case 'duo': return 40;
      case 'trio': return 70;
      case 'pro': return 100;
      default: return 50;
    }
  }

  function getDefaultIpAddresses(type) {
    switch(type) {
      case 'eco': return 1;
      case 'duo': return 2;
      case 'trio': return 2;
      case 'pro': return 4;
      default: return 1;
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getModalTitle = () => {
    switch(configType) {
      case 'eco': return 'Configuration ECO';
      case 'duo': return 'Configuration DUO';
      case 'trio': return 'Configuration TRIO';
      case 'pro': return 'Configuration PRO';
      default: return 'Configuration';
    }
  };

  const getModalHeaderColor = () => {
    switch(configType) {
      case 'eco': return '#28a745';
      case 'duo': return '#007bff';
      case 'trio': return '#fd7e14';
      case 'pro': return '#6f42c1';
      default: return '#0275d8';
    }
  };

  return (
    <>
      <div className="config-modal-overlay">
        <div className="config-modal">
          <div className="config-modal-header" style={{ backgroundColor: getModalHeaderColor() }}>
            <h3>{getModalTitle()}</h3>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="config-modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="vmName">Nom de la VM</label>
                <input
                  type="text"
                  id="vmName"
                  name="vmName"
                  value={formData.vmName}
                  onChange={handleChange}
                  placeholder="my-server"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="operatingSystem">Système d'exploitation</label>
                <select
                  id="operatingSystem"
                  name="operatingSystem"
                  value={formData.operatingSystem}
                  onChange={handleChange}
                >
                  <option value="ubuntu">Ubuntu 22.04 LTS</option>
                  <option value="debian">Debian 11</option>
                  <option value="centos">CentOS 8</option>
                  <option value="windows">Windows Server 2022</option>
                </select>
              </div>

              <div className="resource-sliders">
                <h4>Ressources</h4>
                
                <div className="form-group">
                  <label htmlFor="cpu">CPU ({formData.cpu} vCores)</label>
                  <input
                    type="range"
                    id="cpu"
                    name="cpu"
                    min={formData.cpuRange.min}
                    max={formData.cpuRange.max}
                    value={formData.cpu}
                    onChange={handleRangeChange}
                    step="1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ram">RAM ({formData.ram} Go)</label>
                  <input
                    type="range"
                    id="ram"
                    name="ram"
                    min={formData.ramRange.min}
                    max={formData.ramRange.max}
                    value={formData.ram}
                    onChange={handleRangeChange}
                    step="1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ssd">Espace disque ({formData.ssd} Go)</label>
                  <input
                    type="range"
                    id="ssd"
                    name="ssd"
                    min={formData.ssdRange.min}
                    max={formData.ssdRange.max}
                    value={formData.ssd}
                    onChange={handleRangeChange}
                    step="10"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="ipAddresses">Adresses IP publiques</label>
                <select
                  id="ipAddresses"
                  name="ipAddresses"
                  value={formData.ipAddresses}
                  onChange={handleChange}
                >
                  <option value="1">1 adresse IP</option>
                  {(configType === 'duo' || configType === 'trio' || configType === 'pro') && (
                    <option value="2">2 adresses IP</option>
                  )}
                  {(configType === 'pro') && (
                    <>
                      <option value="3">3 adresses IP</option>
                      <option value="4">4 adresses IP</option>
                    </>
                  )}
                </select>
              </div>

              <div className="form-options">
                <div className="form-group checkbox">
                  <input
                    type="checkbox"
                    id="backup"
                    name="backup"
                    checked={formData.backup}
                    onChange={handleChange}
                  />
                  <label htmlFor="backup">Sauvegarde automatique</label>
                </div>

                <div className="form-group checkbox">
                  <input
                    type="checkbox"
                    id="firewall"
                    name="firewall"
                    checked={formData.firewall}
                    onChange={handleChange}
                  />
                  <label htmlFor="firewall">Pare-feu mutualisé</label>
                </div>

                {(configType === 'duo' || configType === 'trio' || configType === 'pro') && (
                  <>
                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        id="vlan"
                        name="vlan"
                        checked={formData.vlan}
                        onChange={handleChange}
                      />
                      <label htmlFor="vlan">VLAN dédié</label>
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        id="vpn"
                        name="vpn"
                        checked={formData.vpn}
                        onChange={handleChange}
                      />
                      <label htmlFor="vpn">VPN intégré</label>
                    </div>
                  </>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={onClose}>
                  Annuler
                </button>
                <button type="submit" className="submit-button">
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .modal-open {
          overflow: hidden;
        }

        .config-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .config-modal {
          background-color: white;
          border-radius: 8px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .config-modal-header {
          padding: 15px 20px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .config-modal-header h3 {
          margin: 0;
          font-size: 1.25rem;
        }

        .close-button {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }

        .close-button:hover {
          color: #f0f0f0;
        }

        .config-modal-body {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .form-group input[type="text"],
        .form-group select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        .form-group input[type="range"] {
          width: 100%;
          margin: 5px 0;
        }

        .resource-sliders h4 {
          margin-bottom: 15px;
          color: #333;
        }

        .form-group.checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-group.checkbox input {
          margin: 0;
        }

        .form-options {
          margin: 20px 0;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .cancel-button,
        .submit-button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }

        .cancel-button {
          background-color: #f0f0f0;
          color: #333;
        }

        .cancel-button:hover {
          background-color: #e0e0e0;
        }

        .submit-button {
          background-color: #0275d8;
          color: white;
        }

        .submit-button:hover {
          background-color: #025aa5;
        }
      `}</style>
    </>
  );
};

export default ConfigurationModal;