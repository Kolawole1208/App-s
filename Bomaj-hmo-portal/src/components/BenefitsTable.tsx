import './BenefitsTable.css'

interface Benefit {
  id: number
  name: string
  status: string
}

const BenefitsTable = () => {
  // Your benefits data
  const benefits: Benefit[] = [
    { id: 1, name: "24 Hour Creatinine Clearance", status: "Covered" },
    { id: 2, name: "ALT (Sgpt) Serum", status: "Covered" },
    { id: 3, name: "Access To Gyms For Regular Exercise", status: "COVERED (1 SESSIONS PER WEEK)" },
    { id: 4, name: "Access To Prescribed Drugs", status: "COVERED" },
    { id: 5, name: "Advanced Ocular Tests", status: "Not Covered" },
    { id: 6, name: "After-Demise Compensation", status: "COVERED (UP TO 50,000 NAIRA LIMIT)" },
    { id: 7, name: "Annual Visual Acuity Check", status: "Covered" },
    { id: 8, name: "Arthroscopy", status: "Not Covered" },
    { id: 9, name: "Blood Group Check", status: "Not Covered" },
    { id: 10, name: "CT Scan", status: "COVERED (1 SESSION PER ANNUM)" },
    { id: 11, name: "Dialysis And All Related Care", status: "COVERED (3 SESSIONS PER YEAR)" }
  ]

  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes('covered')) return 'status-covered'
    if (status.toLowerCase().includes('not')) return 'status-not-covered'
    return 'status-pending'
  }

  return (
    <section className="benefits-section">
      <div className="table-container">
        <table className="benefits-table">
          <thead>
            <tr>
              <th>Benefit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {benefits.map((benefit) => (
              <tr key={benefit.id}>
                <td className="benefit-name">{benefit.name}</td>
                <td>
                  <span className={`status-badge ${getStatusColor(benefit.status)}`}>
                    {benefit.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default BenefitsTable