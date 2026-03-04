import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, LogOut } from 'lucide-react';

export default function Header({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);
        navigate('/');
    };

    return (
        <header className="glass-panel border-b-0 sticky top-4 mx-4 rounded-xl z-50 mt-4 px-2">
            <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Activity className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
                        MediVoice AI
                    </h1>
                </Link>

                {user ? (
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end hidden sm:flex">
                            <span className="text-sm font-semibold text-primary/70 capitalize">
                                {user.username}
                            </span>
                            <span className="text-xs text-primary/70 capitalize bg-slate-100 px-2 py-0.5 rounded-full">
                                {user.role}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-red-50 rounded-lg text-primary/70 hover:text-red-500 transition-colors border border-transparent hover:border-red-100"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="text-sm font-medium text-primary/70 hover:text-primary transition-colors">
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
}
