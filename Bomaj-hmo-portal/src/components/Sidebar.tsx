import './Sidebar.css'

const Sidebar = () => {
  const menuItems = [
    { icon: 'fas fa-tachometer-alt', label: 'Dashboard', active: true },
    { icon: 'fas fa-user-md', label: 'Consult a Doctor' },
    { icon: 'fas fa-hospital-user', label: 'My Hospitals' },
    { icon: 'fas fa-pills', label: 'My Benefits' },
    { icon: 'fas fa-cog', label: 'Settings' }
  ]

  return (
    <nav className="sidebar">
      <div className="logo">
        <h2><i className="fas fa-heartbeat"></i> Bomaj HMO</h2>
      </div>
      <ul className="nav-links">
        {menuItems.map((item, index) => (
          <li key={index}>
            <a href="#" className={item.active ? 'active' : ''}>
              <i className={item.icon}></i> {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Sidebar