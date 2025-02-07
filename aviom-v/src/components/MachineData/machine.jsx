import React from 'react';

function MachineDetails({key, machine }) {
  if (!machine) {
    return null;
  }

  return (
    <div className="machine-item" style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
      <h4>{machine.name}</h4>
      <p><strong>ID :</strong> {machine.id}</p>
      <p><strong>Statut :</strong> {machine.status}</p>
      <p><strong>Key Name :</strong> {machine.key_name}</p>

      <pre style={{ fontSize: '0.8rem' }}>{JSON.stringify(machine, null, 2)}</pre>
    </div>
  );
}

export default MachineDetails;
