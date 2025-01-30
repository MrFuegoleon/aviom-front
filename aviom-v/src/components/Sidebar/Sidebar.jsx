import './Sidebar.css'

const Sidebar = ({ setPage }) => {
  return (
    <aside className="sidebar">
      <h1 className="logo">Aviom</h1>
      <nav className="nav-menu">
      <ul>
        <li onClick={() => setPage("dashboard")}>Informations Personnelles</li>
        <li onClick={() => setPage("serveurs")}>Gérer mes Serveurs</li>
        <li onClick={() => setPage("contacts")}>Gestion des Contacts</li>
        <li onClick={() => setPage("services")}>Commander un Service</li>
        <li onClick={() => setPage("facturation")}>Facturation & Avoirs</li>
        <li onClick={() => setPage("support")}>Support & Assistance</li>
      </ul>
      </nav>
      <button className="subscribe-btn">Inscription Newsletter</button>
    </aside>
  )
}

export default Sidebar;
