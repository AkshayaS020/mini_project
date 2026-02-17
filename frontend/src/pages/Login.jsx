import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Stethoscope, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Login({ setUser }) {
    const [role, setRole] = useState('doctor');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch('http://localhost:8000/token', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Incorrect username or password');
            }

            const data = await response.json();

            const mockUser = {
                username: username,
                role: role,
                token: data.access_token
            };

            setUser(mockUser);
            if (role === 'doctor') navigate('/record');
            else navigate('/reports');

        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

            <div className="w-full max-w-md glass-panel p-8 relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 text-primary">
                        <Stethoscope className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Welcome Back</h2>
                    <p className="text-slate-500">Secure access to your clinical dashboard</p>
                </div>

                <div className="flex gap-4 mb-8 bg-slate-100/50 p-1.5 rounded-xl backdrop-blur-sm">
                    <button
                        onClick={() => setRole('doctor')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${role === 'doctor'
                            ? 'bg-white text-primary shadow-sm shadow-slate-200'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                            }`}
                    >
                        <Stethoscope className="h-4 w-4" /> Doctor
                    </button>
                    <button
                        onClick={() => setRole('patient')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${role === 'patient'
                            ? 'bg-white text-primary shadow-sm shadow-slate-200'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                            }`}
                    >
                        <User className="h-4 w-4" /> Patient
                    </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-300 placeholder:text-slate-400"
                            placeholder={`Enter ${role} username...`}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-300 placeholder:text-slate-400 pr-10"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 mt-4 group"
                    >
                        {loading ? 'Authenticating...' : (
                            <>
                                Sign In <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </div >
        </div >
    );
}
