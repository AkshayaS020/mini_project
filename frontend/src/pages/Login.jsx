import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, User, ArrowRight, Eye, EyeOff, AlertCircle, Heart } from 'lucide-react';

const API = 'http://localhost:8000';

export default function Login({ setUser }) {
    const [role, setRole] = useState('doctor');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const res = await fetch(`${API}/token`, { method: 'POST', body: formData });
            if (!res.ok) throw new Error('Incorrect username or password. Please try again.');

            const data = await res.json();
            setUser({ username, role, token: data.access_token });
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isDoctor = role === 'doctor';

    return (
        <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #EEF2F7 0%, #E0ECFF 100%)' }}>
            {/* Left Panel – visual */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-accent items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-white/10 animate-blob" />
                <div className="absolute bottom-20 right-10 h-48 w-48 rounded-full bg-white/10 animate-blob animation-delay-2000" />
                <div className="relative z-10 text-white max-w-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                            <Stethoscope className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">MediVoice AI</h1>
                            <p className="text-blue-100 text-xs">Clinical Assistant</p>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold leading-tight mb-4">
                        AI-powered medical consultation, simplified.
                    </h2>
                    <p className="text-blue-100 text-sm leading-relaxed">
                        Record consultations, generate SOAP notes automatically, and maintain structured patient records — all in one place.
                    </p>
                    <div className="mt-8 grid grid-cols-2 gap-4">
                        {[
                            { icon: '🎙️', label: 'Voice Recording' },
                            { icon: '🤖', label: 'AI Analysis' },
                            { icon: '📋', label: 'SOAP Notes' },
                            { icon: '📄', label: 'PDF Reports' },
                        ].map(f => (
                            <div key={f.label} className="bg-white/10 rounded-xl p-3 flex items-center gap-2 text-sm font-medium">
                                <span>{f.icon}</span> {f.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel – form */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    {/* Mobile brand */}
                    <div className="flex items-center gap-3 mb-8 lg:hidden">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                            <Stethoscope className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-primary/70">MediVoice AI</span>
                    </div>

                    <div className="card p-8">
                        {/* Title */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
                            <p className="text-primary/70 text-sm mt-1">Sign in to access your clinical dashboard</p>
                        </div>

                        {/* Role Toggle */}
                        <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl">
                            {[
                                { id: 'doctor', icon: Stethoscope, label: 'Doctor' },
                                { id: 'patient', icon: User, label: 'Patient' },
                            ].map(({ id, icon: Icon, label }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setRole(id)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                                        ${role === id
                                            ? 'bg-white text-primary shadow-sm'
                                            : 'text-primary/70 hover:text-primary/70 hover:bg-white/50'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" /> {label}
                                </button>
                            ))}
                        </div>

                        {/* Credentials hint */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5 text-xs text-secondary">
                            <strong>Demo credentials:</strong> username = <code className="font-mono bg-blue-100 px-1 rounded">{isDoctor ? 'doctor' : 'patient'}</code> · password = <code className="font-mono bg-blue-100 px-1 rounded">password123</code>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder={isDoctor ? 'doctor' : 'patient'}
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    required
                                    autoComplete="username"
                                />
                            </div>
                            <div>
                                <label className="form-label">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-input pr-10"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/70 hover:text-primary/70 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-3 mt-2 text-base group"
                            >
                                {loading ? 'Signing in…' : (
                                    <>Sign In <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-xs text-primary/70 mt-4 flex items-center justify-center gap-1">
                        Made with <Heart className="h-3 w-3 text-red-400 fill-red-400" /> for better healthcare
                    </p>
                </div>
            </div>
        </div>
    );
}
