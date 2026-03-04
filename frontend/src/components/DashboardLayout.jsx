import React from 'react';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children, user, setUser }) {
    const handleLogout = () => {
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen flex bg-[#EEF2F7]">
            <Sidebar user={user} onLogout={handleLogout} />

            {/* Main Content */}
            <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
                {/* Top Bar */}
                <div className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/70 flex items-center px-8 gap-4 no-print">
                    <div className="flex-1" />
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-primary/70 font-medium hidden sm:block">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <div className="h-8 w-px bg-slate-200" />
                        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                                {user?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="text-left hidden sm:block">
                                <p className="text-xs font-semibold text-primary/70 leading-none">{user?.username}</p>
                                <p className="text-[10px] text-primary/70 capitalize mt-0.5">{user?.role}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-8">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
