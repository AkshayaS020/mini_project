import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Settings, LogOut, Activity, Plus } from 'lucide-react';

export default function Sidebar({ user, onLogout }) {
    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: FileText, label: 'Reports', path: '/reports' },
        { icon: Users, label: 'Patients', path: '/patients' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="w-72 h-screen fixed left-0 top-0 bg-slate-900 text-white flex flex-col z-50 transition-all duration-300">
            {/* Brand */}
            <div className="h-20 flex items-center gap-3 px-8 border-b border-slate-800">
                <div className="p-2 bg-primary rounded-lg">
                    <Activity className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">MediVoice AI</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-2">
                <div className="mb-8 px-4">
                    <NavLink
                        to="/record"
                        className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 group"
                    >
                        <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" /> New Consultation
                    </NavLink>
                </div>

                <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu</p>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-white/10 text-white shadow-sm border border-white/5'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <item.icon className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-slate-800">
                <div className="bg-slate-800/50 rounded-xl p-4 flex items-center justify-between group hover:bg-slate-800 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-300 font-bold">
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">{user?.username || 'User'}</p>
                            <p className="text-xs text-slate-400 capitalize">{user?.role || 'Role'}</p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Logout"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
