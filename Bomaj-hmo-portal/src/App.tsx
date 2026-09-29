import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container">
      {/* Sidebar Navigation */}
      <nav className="sidebar">
        <div className="logo">
          <h2><i className="fas fa-heartbeat"></i> Bomaj HMO</h2>
        </div>
        <ul className="nav-links">
          <li><a href="#" className="active"><i className="fas fa-tachometer-alt"></i> Dashboard</a></li>
          <li><a href="#"><i className="fas fa-user-md"></i> Consult a Doctor</a></li>
          <li><a href="#"><i className="fas fa-hospital-user"></i> My Hospitals</a></li>
          <li><a href="#"><i className="fas fa-pills"></i> My Benefits</a></li>
          <li><a href="#"><i className="fas fa-cog"></i> Settings</a></li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="top-bar">
          <h1>My Benefits</h1>
          <div className="search-box">
            <input type="text" id="searchInput" placeholder="Search Benefits..." />
            <i className="fas fa-search"></i>
          </div>
        </header>

        <section className="benefits-section">
          <table className="benefits-table">
            <thead>
              <tr>
                <th>Benefit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="benefitsTableBody">
              {/* Inside your table body */}
              <tr><td>24 Hour Creatinine Clearance</td><td className="status-covered">Covered</td></tr>
              <tr><td>ALT (Sgpt) Serum</td><td className="status-covered">Covered</td></tr>
              <tr><td>Access To Gyms For Regular Exercise</td><td className="status-covered">COVERED (1 SESSIONS PER WEEK)</td></tr>
              <tr><td>Access To Prescribed Drugs</td><td className="status-covered">COVERED</td></tr>
              <tr><td>Advanced Ocular Tests</td><td className="status-not-covered">Not Covered</td></tr>
              <tr><td>After-Demise Compensation</td><td className="status-covered">COVERED (UP TO 50,000 NAIRA LIMIT)</td></tr>
              <tr><td>Annual Visual Acuity Check</td><td className="status-covered">Covered</td></tr>
              <tr><td>Arthroscopy</td><td className="status-not-covered">Not Covered</td></tr>
              <tr><td>Blood Group Check</td><td className="status-not-covered">Not Covered</td></tr>
              <tr><td>CT Scan</td><td className="status-covered">COVERED (1 SESSION PER ANNUM)</td></tr>
              <tr><td>Dialysis And All Related Care</td><td className="status-covered">COVERED (3 SESSIONS PER YEAR)</td></tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  )
}

export default App