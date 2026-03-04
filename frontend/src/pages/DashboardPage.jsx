import React, { useState, useEffect } from 'react';
import {
    Users, FileText, Activity, Calendar,
    Stethoscope, User, Mic, ArrowRight, Loader2, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:8000';

function StatCard({ icon: Icon, label, value, color, bg }) {
    return (
        <div className="card p-5 flex items-center gap-4">
            <div className={`h-12 w-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-6 w-6 ${color}`} />
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-sm text-primary/70">{label}</p>
            </div>
        </div>
    );
}

export default function DashboardPage({ user }) {
    const [consultations, setConsultations] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const isDoctor = user?.role === 'doctor';

    useEffect(() => {
        Promise.all([
            fetchConsultations(),
            fetchProfile()
        ]).finally(() => setLoading(false));
    }, []);

    async function fetchConsultations() {
        try {
            const res = await fetch(`${API}/consultations`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) setConsultations(await res.json());
        } catch (e) {
            setError('Could not load consultations.');
        }
    }

    async function fetchProfile() {
        try {
            const res = await fetch(`${API}/profile`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            }
        } catch (_) { }
    }

    const fmtDate = (iso) => {
        try {
            return new Date(iso).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
            });
        } catch { return iso; }
    };

    const recent = consultations.slice(0, 5);

    return (
        <div className="space-y-6 animate-in">
            {/* Greeting Header */}
            <div className="card p-6 bg-gradient-to-r from-primary to-accent text-white border-none">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-blue-100 text-sm font-medium">
                            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <h2 className="text-2xl font-bold mt-1">
                            Good {getGreeting()}, {isDoctor ? 'Dr. ' : ''}{user?.username}! 👋
                        </h2>
                        <p className="text-blue-100 text-sm mt-1">
                            {isDoctor
                                ? 'Here\'s your clinical overview for today.'
                                : 'Here\'s a summary of your health records.'}
                        </p>
                    </div>
                    <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                        {isDoctor
                            ? <Stethoscope className="h-8 w-8 text-white" />
                            : <User className="h-8 w-8 text-white" />
                        }
                    </div>
                </div>
            </div>

            {/* Profile prompt for patients with no profile */}
            {!isDoctor && !profile && !loading && (
                <div className="card p-5 border border-amber-200 bg-amber-50 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-amber-800 text-sm">Profile not set up</p>
                            <p className="text-amber-600 text-xs mt-0.5">Create your health profile to get the most out of MediVoice AI.</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/profile')} className="btn-primary text-xs whitespace-nowrap flex-shrink-0">
                        Set Up Profile <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={FileText} label="Total Consultations" value={consultations.length} color="text-primary" bg="bg-blue-50" />
                <StatCard icon={Activity} label="Unique Patients" value={countUnique(consultations, 'patient_name')} color="text-accent" bg="bg-teal-50" />
                <StatCard icon={Calendar} label="This Month" value={countThisMonth(consultations)} color="text-purple-600" bg="bg-purple-50" />
                <StatCard icon={Stethoscope} label="Doctors" value={countUnique(consultations, 'doctor_username')} color="text-emerald-600" bg="bg-emerald-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Consultations */}
                <div className="lg:col-span-2 card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-primary/70 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" /> Recent Consultations
                        </h3>
                        <button onClick={() => navigate('/reports')} className="text-xs text-primary hover:text-secondary font-semibold flex items-center gap-1">
                            View all <ArrowRight className="h-3 w-3" />
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <Loader2 className="h-6 w-6 text-primary animate-spin" />
                        </div>
                    ) : recent.length === 0 ? (
                        <div className="text-center py-10">
                            <FileText className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                            <p className="text-primary/70 text-sm">No consultations yet.</p>
                            {isDoctor && (
                                <button onClick={() => navigate('/record')} className="btn-primary mt-3 text-sm">
                                    <Mic className="h-4 w-4" /> Start Recording
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recent.map((c) => (
                                <div
                                    key={c.id}
                                    onClick={() => navigate('/reports')}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100"
                                >
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 text-secondary flex items-center justify-center text-sm font-bold flex-shrink-0">
                                        {(c.patient_name || '?')[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-primary/70 text-sm truncate">{c.patient_name || '—'}</p>
                                        <p className="text-xs text-primary/70">
                                            Dr. {c.doctor_username || '—'} · {fmtDate(c.created_at)}
                                        </p>
                                    </div>
                                    {c.symptoms?.length > 0 && (
                                        <span className="badge-slate text-[10px]">
                                            {c.symptoms.length} symptom{c.symptoms.length !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions + Profile Summary */}
                <div className="space-y-4">
                    {/* Quick Actions */}
                    <div className="card p-5">
                        <h3 className="font-bold text-primary/70 mb-4 text-sm">Quick Actions</h3>
                        <div className="space-y-2">
                            {isDoctor && (
                                <button
                                    onClick={() => navigate('/record')}
                                    className="w-full flex items-center gap-3 bg-primary hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-md shadow-blue-500/25"
                                >
                                    <Mic className="h-4 w-4" /> New Consultation
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/reports')}
                                className="w-full flex items-center gap-3 bg-slate-50 hover:bg-slate-100 text-primary/70 py-3 px-4 rounded-xl font-semibold text-sm transition-all border border-slate-200"
                            >
                                <FileText className="h-4 w-4 text-primary/70" /> View Reports
                            </button>
                            <button
                                onClick={() => navigate('/profile')}
                                className="w-full flex items-center gap-3 bg-slate-50 hover:bg-slate-100 text-primary/70 py-3 px-4 rounded-xl font-semibold text-sm transition-all border border-slate-200"
                            >
                                <User className="h-4 w-4 text-primary/70" /> My Profile
                            </button>
                        </div>
                    </div>

                    {/* Profile Summary (if exists) */}
                    {profile && (
                        <div className="card p-5">
                            <h3 className="font-bold text-primary/70 mb-3 text-sm">Health Profile</h3>
                            <div className="space-y-2">
                                {[
                                    { label: 'Name', value: profile.name },
                                    { label: 'Age', value: profile.age ? `${profile.age} yrs` : null },
                                    { label: 'Gender', value: profile.gender },
                                    { label: 'Weight', value: profile.weight ? `${profile.weight} kg` : null },
                                    { label: 'Height', value: profile.height ? `${profile.height} cm` : null },
                                ].filter(i => i.value).map(({ label, value }) => (
                                    <div key={label} className="flex justify-between text-sm">
                                        <span className="text-primary/70">{label}</span>
                                        <span className="text-primary/70 font-medium">{value}</span>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => navigate('/profile')} className="mt-3 text-xs text-primary hover:text-secondary font-semibold">
                                Edit Profile →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Helpers
function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
}

function countUnique(arr, key) {
    return new Set(arr.map(i => i[key]).filter(Boolean)).size;
}

function countThisMonth(arr) {
    const now = new Date();
    return arr.filter(c => {
        try {
            const d = new Date(c.created_at);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        } catch { return false; }
    }).length;
}
