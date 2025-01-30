import './Sidebar.css'
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h1 className="logo">Aviom</h1>
      <nav className="nav-menu">
        <ul>
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/services">Gérer mes Services</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/commande">Commander un Service</Link></li>
          <li><Link to="/facturation">Facturation & Avoirs</Link></li>
          <li><Link to="/informations">Informations personnelles</Link></li>
          <li><Link to="/support">Support & Assistance</Link></li>
        </ul>
      </nav>
      <button className="subscribe-btn">Inscription Newsletter</button>
    </aside>
  )
}

export default Sidebar;

