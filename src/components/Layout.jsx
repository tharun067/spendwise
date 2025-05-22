import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className='flex h-screen bg-#f9fafb'>
      {/**Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/**Main Content */}
      <div className='flex flex-col flex-1 overflow-hidden'>
        <Navbar toggleSidebar={toggleSidebar} />
        <main className='flex-1 overflow-y-auto p-4 md:p-6'>
          <div className='container mx-auto'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout
