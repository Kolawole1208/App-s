import './TopBar.css'

interface TopBarProps {
  title: string
}

const TopBar = ({ title }: TopBarProps) => {
  return (
    <header className="top-bar">
      <h1>{title}</h1>
      <div className="search-box">
        <input 
          type="text" 
          placeholder="Search Benefits..." 
          className="search-input"
        />
        <i className="fas fa-search search-icon"></i>
      </div>
    </header>
  )
}

export default TopBar