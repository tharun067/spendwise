import React from 'react'
import { useAuth } from '../hooks/useAuth';

function DashboardHeader() {
    const { currentUser } = useAuth();
    // Get current time to display appropriate greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-neutral-800 sm:text-3xl">
                {getGreeting()}, <span className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 bg-clip-text text-transparent">
                    {currentUser?.displayName?.split(' ')[0] || 'User'}
                </span>
            </h1>
            <p className="mt-2 text-neutral-600">
                Welcome to your financial dashboard. Here's a summary of your finances.
            </p>
        </div>
    );
}

export default DashboardHeader
