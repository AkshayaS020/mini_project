import React, { useState, useEffect } from 'react';
import {
    User, Briefcase, Award, MapPin, Save, CheckCircle, AlertCircle, Edit3, X, Stethoscope, Phone
} from 'lucide-react';

const API = 'http://localhost:8000';

function Section({ icon: Icon, title, color, children }) {
    return (
        <div className="card p-6">
            <div className={`flex items-center gap-2 mb-5 pb-3 border-b border-slate-100`}>
                <div className={`h-8 w-8 rounded-lg ${color} flex items-center justify-center`}>
                    <Icon className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-semibold text-primary/70">{title}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    );
}

function Field({ label, children, full = false }) {
    return (
        <div className={full ? 'sm:col-span-2' : ''}>
            <label className="form-label">{label}</label>
            {children}
        </div>
    );
}

export default function DoctorProfile({ user }) {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({});
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);
    const [isNew, setIsNew] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        setLoading(true);
        try {
            const res = await fetch(`${API}/profile`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data) {
                    setProfile(data);
                    setForm(data);
                    setEditing(false);
                } else {
                    // First time — open editor automatically
                    setIsNew(true);
                    setEditing(true);
                }
            }
        } catch (e) {
            setError('Failed to load profile.');
        } finally {
            setLoading(false);
        }
    }

    function set(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const res = await fetch(`${API}/profile`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });
            if (!res.ok) throw new Error('Save failed');
            const data = await res.json();
            setProfile(data);
            setForm(data);
            setEditing(false);
            setIsNew(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e) {
            setError('Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        {isNew ? 'Create Your Profile' : 'My Health Profile'}
                    </h2>
                    <p className="text-primary/70 text-sm mt-1">
                        {isNew
                            ? 'Fill in your details to get started — this helps doctors provide better care.'
                            : 'Your personal and health information'}
                    </p>
                </div>
                {!editing && profile && (
                    <button onClick={() => setEditing(true)} className="btn-secondary gap-2">
                        <Edit3 className="h-4 w-4" /> Edit Profile
                    </button>
                )}
            </div>

            {/* Alerts */}
            {saved && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl">
                    <CheckCircle className="h-4 w-4" /> Profile saved successfully!
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                    <AlertCircle className="h-4 w-4" /> {error}
                </div>
            )}

            {!editing && profile ? (
                /* ── VIEW MODE ── */
                <div className="space-y-4">
                    {/* Profile Card */}
                    <div className="card p-6 flex items-center gap-5">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            {(profile.name || user.username)?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Dr. {profile.name || user.username}</h3>
                            <p className="text-primary/70 text-sm">{profile.specialty || 'General Practice'} · {profile.experience ? `${profile.experience} years exp.` : '—'}</p>
                            <p className="text-primary/70 text-xs mt-1">{profile.phone || 'No phone'} · {profile.clinic_name || 'No clinic added'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Section icon={Stethoscope} title="Professional Details" color="bg-blue-500">
                            <div className="sm:col-span-2 space-y-3">
                                <Row label="Specialty" value={profile.specialty || '—'} />
                                <Row label="Experience" value={profile.experience ? `${profile.experience} years` : '—'} />
                                <Row label="Qualifications" value={profile.qualifications || '—'} />
                                <Row label="Consultation Fee" value={profile.consultation_fee ? `₹${profile.consultation_fee}` : '—'} />
                            </div>
                        </Section>

                        <Section icon={MapPin} title="Clinic Information" color="bg-emerald-600">
                            <div className="sm:col-span-2 space-y-3">
                                <Row label="Clinic Name" value={profile.clinic_name || '—'} />
                                <Row label="Address" value={profile.clinic_address || '—'} />
                                <Row label="Phone" value={profile.phone || '—'} />
                            </div>
                        </Section>
                    </div>
                </div>
            ) : (
                /* ── EDIT MODE ── */
                <form onSubmit={handleSave} className="space-y-5">
                    {/* Basic Information */}
                    <Section icon={User} title="Professional Information" color="bg-primary">
                        <Field label="Full Name">
                            <input className="form-input" value={form.name || ''} onChange={e => set('name', e.target.value)} placeholder="Your full name" />
                        </Field>
                        <Field label="Specialty">
                            <input className="form-input" value={form.specialty || ''} onChange={e => set('specialty', e.target.value)} placeholder="e.g. Cardiology" />
                        </Field>
                        <Field label="Years of Experience">
                            <input className="form-input" type="number" min="0" value={form.experience || ''} onChange={e => set('experience', e.target.value ? +e.target.value : null)} placeholder="e.g. 10" />
                        </Field>
                        <Field label="Qualifications" full>
                            <input className="form-input" value={form.qualifications || ''} onChange={e => set('qualifications', e.target.value)} placeholder="e.g. MBBS, MD" />
                        </Field>
                    </Section>

                    {/* Clinic Information */}
                    <Section icon={MapPin} title="Clinic Information" color="bg-emerald-600">
                        <Field label="Clinic Name" full>
                            <input className="form-input" value={form.clinic_name || ''} onChange={e => set('clinic_name', e.target.value)} placeholder="e.g. City Care Clinic" />
                        </Field>
                        <Field label="Clinic Address" full>
                            <input className="form-input" value={form.clinic_address || ''} onChange={e => set('clinic_address', e.target.value)} placeholder="Street, City, State" />
                        </Field>
                        <Field label="Phone Number">
                            <input className="form-input" value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" />
                        </Field>
                        <Field label="Consultation Fee (₹)">
                            <input className="form-input" type="number" min="0" value={form.consultation_fee || ''} onChange={e => set('consultation_fee', e.target.value ? +e.target.value : null)} placeholder="e.g. 500" />
                        </Field>
                    </Section>

                    {/* Actions */}
                    <div className="flex items-center gap-3 justify-end">
                        {!isNew && (
                            <button type="button" onClick={() => { setEditing(false); setForm(profile); }} className="btn-secondary">
                                <X className="h-4 w-4" /> Cancel
                            </button>
                        )}
                        <button type="submit" disabled={saving} className="btn-primary">
                            <Save className="h-4 w-4" />
                            {saving ? 'Saving…' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex items-start justify-between text-sm">
            <span className="text-primary/70 font-medium w-32 flex-shrink-0">{label}</span>
            <span className="text-primary/70 text-right">{value}</span>
        </div>
    );
}
