import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {FiHome, FiPieChart, FiX, FiCreditCard, FiInfo} from 'react-icons/fi';
import Logo from './Logo';

function Sidebar({ isOpen, toggleSidebar }) {
    const location = useLocation();

    // Navigation Links
    const navLinks = [
        { name: 'Dashboard', path: '/', icon: <FiHome size={20} /> },
        { name: 'How It works', path: '/how-it-works', icon: <FiInfo size={20} /> }
    ];

    return (
        <>
            {/* Mobile sidebar backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-neutral-900 bg-opacity-50 z-20 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}
      
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Sidebar header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200">
                    {/*<Logo />*/}
                    <button
                        className="text-neutral-600 hover:text-primary-500 lg:hidden"
                        onClick={toggleSidebar}
                        aria-label="Close sidebar"
                    >
                        <FiX size={24} />
                    </button>
                </div>
        
                {/* Sidebar content */}
                <div className="py-4">
                    <nav>
                        <ul>
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className={`flex items-center px-4 py-3 text-sm font-medium ${location.pathname === link.path
                                                ? 'text-primary-600 bg-primary-50'
                                                : 'text-neutral-600 hover:bg-neutral-100'
                                            }`}
                                        onClick={() => {
                                            if (window.innerWidth < 1024) {
                                                toggleSidebar();
                                            }
                                        }}
                                    >
                                        <span className="mr-3">{link.icon}</span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
          
                    {/* Financial summary cards */}
                    <div className="mt-6 px-4">
                        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                            Financial Overview
                        </h3>
            
                        <div className="space-y-3">
                            <div className="bg-primary-50 rounded-lg p-3">
                                <div className="flex items-center text-primary-600 mb-1">
                                    <FiPieChart size={16} className="mr-2" />
                                    <span className="text-xs font-medium">Current Balance</span>
                                </div>
                                <p className="text-lg font-semibold text-primary-700">
                                    <span className="text-xs">$</span> <span id="sidebar-balance">0.00</span>
                                </p>
                            </div>
              
                            <div className="bg-accent-50 rounded-lg p-3">
                                <div className="flex items-center text-accent-600 mb-1">
                                    <FiCreditCard size={16} className="mr-2" />
                                    <span className="text-xs font-medium">Monthly Savings</span>
                                </div>
                                <p className="text-lg font-semibold text-accent-700">
                                    <span className="text-xs">$</span> <span id="sidebar-savings">0.00</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Sidebar
