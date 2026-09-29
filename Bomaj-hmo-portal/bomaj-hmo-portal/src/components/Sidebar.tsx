import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/members', label: 'Members', icon: '👥' },
    { path: '/providers', label: 'Providers', icon: '🏥' },
    { path: '/claims', label: 'Claims', icon: '📄' },
    { path: '/billing', label: 'Billing', icon: '💰' },
  ];

  return (
    <div className='w-64 bg-gray-900 text-white min-h-screen'>
      <div className='p-4'>
        <h2 className='text-xl font-bold mb-6'>HMO Portal</h2>
        <ul className='space-y-2'>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? 'p-3 rounded cursor-pointer flex items-center bg-blue-600 text-white'
                    : 'p-3 rounded cursor-pointer flex items-center hover:bg-gray-800'
                }
              >
                <span className='mr-3'>{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
