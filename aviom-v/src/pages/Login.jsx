import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const data = await login(username, password);
    if (data) {
      alert("Connexion réussie !");
      navigate("/dashboard");
    } else {
      alert("Échec de la connexion.");
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <input type="text" placeholder="Nom d'utilisateur" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Se connecter</button>
    </div>
  );
};

export default Login;
