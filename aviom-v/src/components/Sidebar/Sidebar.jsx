import './Sidebar.css'

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h1 className="logo">Aviom</h1>
      <nav className="nav-menu">
        <ul>
          <li> Informations Personnelles</li>
          <li> Gérer mes Services</li>
          <li> Gestion des Contacts</li>
          <li> Commander un Service</li>
          <li> Facturation & Avoirs</li>
          <li> Support & Assistance</li>
        </ul>
      </nav>
      <button className="subscribe-btn">Inscription Newsletter</button>
    </aside>
  )
}

export default Sidebar;
