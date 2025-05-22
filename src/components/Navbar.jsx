import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth';
import Logo from './Logo';
import { FiMenu, FiBell, FiUser, FiLogOut, FiHelpCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';


function Navbar({ toggleSidebar }) {
    const { currentUser, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed', error);
        }
    }


    return (
        <nav className="bg-white border-b border-neutral-200 h-16 flex items-center px-4 md:px-6">
            <div className="container mx-auto flex justify-between items-center">
                {/* Left side */}
                <div className="flex items-center">
                    <button
                        className="mr-4 text-neutral-600 hover:text-primary-500 lg:hidden"
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <FiMenu size={24} />
                    </button>
                    <div className="md:block">
                        <Logo />
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center">
                    <Link to="/how-it-works" className="flex items-center text-neutral-600 hover:text-primary-500 mx-4">
                        <FiHelpCircle size={20} />
                        <span className="ml-1 hidden md:inline">Help</span>
                    </Link>
          
                    <button className="text-neutral-600 hover:text-primary-500 mx-4">
                        <FiBell size={20} />
                    </button>
          
                    {/* User profile dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            className="flex items-center text-neutral-600 hover:text-primary-500"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                                {currentUser?.displayName?.charAt(0) || 'U'}
                            </div>
                            <span className="ml-2 hidden md:inline">{currentUser?.displayName}</span>
                        </button>
            
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 animate-fade-in">
                                <div className="px-4 py-2 border-b border-neutral-200">
                                    <p className="text-sm font-medium">{currentUser?.displayName}</p>
                                    <p className="text-xs text-neutral-500 truncate">{currentUser?.email}</p>
                                </div>
                                <Link
                                    to="/profile"
                                    className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    <FiUser size={16} className="mr-2" />
                                    Profile
                                </Link>
                                <button
                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                                    onClick={handleLogout}
                                >
                                    <FiLogOut size={16} className="mr-2" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar
