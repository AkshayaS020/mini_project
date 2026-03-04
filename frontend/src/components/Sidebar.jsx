import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, FileText, Users, Settings,
    LogOut, Activity, Plus, UserCircle, Stethoscope
} from 'lucide-react';

export default function Sidebar({ user, onLogout }) {
    const isDoctor = user?.role === 'doctor';

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: FileText, label: 'Reports', path: '/reports' },
        ...(isDoctor ? [{ icon: Users, label: 'Patients', path: '/patients' }] : []),
        { icon: UserCircle, label: 'My Profile', path: '/profile' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 flex flex-col z-40 no-print"
            style={{ backgroundColor: 'var(--sidebar-bg)' }}>

            {/* Brand */}
            <div className="h-16 flex items-center gap-3 px-6 border-b border-white/10">
                <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
                    <Stethoscope className="h-4 w-4 text-white" />
                </div>
                <div>
                    <h1 className="text-sm font-bold text-white tracking-tight leading-none">MediVoice AI</h1>
                    <p className="text-[10px] text-slate-400 mt-0.5">Clinical Assistant</p>
                </div>
            </div>

            {/* Quick Action - Doctor only */}
            {isDoctor && (
                <div className="px-4 pt-5 pb-2">
                    <NavLink
                        to="/record"
                        className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-[#45a396]
                                   text-white py-2.5 rounded-xl font-semibold text-sm
                                   transition-all shadow-lg shadow-accent/25 group"
                    >
                        <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                        New Consultation
                    </NavLink>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 mt-1">
                    Navigation
                </p>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group text-sm font-medium
                            ${isActive
                                ? 'bg-white/10 text-white shadow-sm border border-white/5'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`h-4 w-4 flex-shrink-0 transition-colors ${isActive ? 'text-accent' : 'text-slate-400 group-hover:text-slate-300'}`} />
                                <span>{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User Footer */}
            <div className="p-3 border-t border-white/10">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{user?.username || 'User'}</p>
                        <p className="text-[10px] text-slate-400 capitalize">{user?.role || 'Role'}</p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Logout"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
