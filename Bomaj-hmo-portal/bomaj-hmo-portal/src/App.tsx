import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Providers from './pages/Providers';
import Claims from './pages/Claims';
import Billing from './pages/Billing';
import './index.css';

function App() {
  return (
    <Router>
      <div className='flex min-h-screen bg-gray-50'>
        <Sidebar />
        <div className='flex-1 flex flex-col'>
          <TopBar />
          <main className='flex-1 p-6'>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/members' element={<Members />} />
              <Route path='/providers' element={<Providers />} />
              <Route path='/claims' element={<Claims />} />
              <Route path='/billing' element={<Billing />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
