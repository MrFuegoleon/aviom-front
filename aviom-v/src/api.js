const API_URL = import.meta.env.VITE_API_URL;

export const fetchClients = async () => {
  const response = await fetch(`${API_URL}/clients`);
  return response.json();
};
