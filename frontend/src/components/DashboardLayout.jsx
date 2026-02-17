import React from 'react';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children, user, setUser }) {
    const handleLogout = () => {
        setUser(null);
        // We'll handle navigation in the App component or Login redirect
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar user={user} onLogout={handleLogout} />

            {/* Main Content Area */}
            <main className="flex-1 ml-72 p-8 overflow-y-auto h-screen flex flex-col items-center">
                <div className="w-full max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
