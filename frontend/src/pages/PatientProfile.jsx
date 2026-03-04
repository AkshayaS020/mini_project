import React, { useState, useEffect } from 'react';
import {
    User, Heart, Apple, Baby, Save, CheckCircle, AlertCircle, Edit3, X
} from 'lucide-react';

const API = 'http://localhost:8000';

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const DIET_OPTIONS = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Gluten-Free', 'Other'];
const VAX_OPTIONS = ['Up to date', 'Partially vaccinated', 'Not vaccinated', 'Unknown'];

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

export default function PatientProfile({ user }) {
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
                            <h3 className="text-xl font-bold text-slate-900">{profile.name || user.username}</h3>
                            <p className="text-primary/70 text-sm">{profile.gender || '—'} · Age {profile.age || '—'}</p>
                            <p className="text-primary/70 text-xs mt-1">{profile.phone || 'No phone'} · {profile.address || 'No address'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Section icon={Heart} title="Health Information" color="bg-red-500">
                            <div className="sm:col-span-2 space-y-3">
                                <Row label="Height" value={profile.height ? `${profile.height} cm` : '—'} />
                                <Row label="Weight" value={profile.weight ? `${profile.weight} kg` : '—'} />
                                <Row label="Conditions" value={profile.health_conditions || '—'} />
                                <Row label="Allergies" value={profile.allergies || '—'} />
                                <Row label="Diet" value={profile.dietary_habits || '—'} />
                            </div>
                        </Section>

                        <Section icon={Baby} title="Child Health" color="bg-accent">
                            <div className="sm:col-span-2 space-y-3">
                                <Row label="Child Age" value={profile.child_age ? `${profile.child_age} yrs` : '—'} />
                                <Row label="Child Weight" value={profile.child_weight ? `${profile.child_weight} kg` : '—'} />
                                <Row label="Child Height" value={profile.child_height ? `${profile.child_height} cm` : '—'} />
                                <Row label="Vaccination" value={profile.vaccination_status || '—'} />
                            </div>
                        </Section>
                    </div>
                </div>
            ) : (
                /* ── EDIT MODE ── */
                <form onSubmit={handleSave} className="space-y-5">
                    {/* Basic Information */}
                    <Section icon={User} title="Basic Information" color="bg-primary">
                        <Field label="Full Name">
                            <input className="form-input" value={form.name || ''} onChange={e => set('name', e.target.value)} placeholder="Your full name" />
                        </Field>
                        <Field label="Age">
                            <input className="form-input" type="number" min="0" max="120" value={form.age || ''} onChange={e => set('age', e.target.value ? +e.target.value : null)} placeholder="Age" />
                        </Field>
                        <Field label="Gender">
                            <select className="form-select" value={form.gender || ''} onChange={e => set('gender', e.target.value)}>
                                <option value="">Select gender</option>
                                {GENDER_OPTIONS.map(g => <option key={g}>{g}</option>)}
                            </select>
                        </Field>
                        <Field label="Phone Number">
                            <input className="form-input" value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" />
                        </Field>
                        <Field label="Address" full>
                            <input className="form-input" value={form.address || ''} onChange={e => set('address', e.target.value)} placeholder="Street, City, State" />
                        </Field>
                    </Section>

                    {/* Health Information */}
                    <Section icon={Heart} title="Health Information" color="bg-red-500">
                        <Field label="Height (cm)">
                            <input className="form-input" type="number" min="0" value={form.height || ''} onChange={e => set('height', e.target.value ? +e.target.value : null)} placeholder="e.g. 165" />
                        </Field>
                        <Field label="Weight (kg)">
                            <input className="form-input" type="number" min="0" value={form.weight || ''} onChange={e => set('weight', e.target.value ? +e.target.value : null)} placeholder="e.g. 60" />
                        </Field>
                        <Field label="Existing Health Conditions" full>
                            <input className="form-input" value={form.health_conditions || ''} onChange={e => set('health_conditions', e.target.value)} placeholder="e.g. Diabetes, Hypertension" />
                        </Field>
                        <Field label="Allergies" full>
                            <input className="form-input" value={form.allergies || ''} onChange={e => set('allergies', e.target.value)} placeholder="e.g. Penicillin, Pollen" />
                        </Field>
                        <Field label="Dietary Habits" full>
                            <select className="form-select" value={form.dietary_habits || ''} onChange={e => set('dietary_habits', e.target.value)}>
                                <option value="">Select diet type</option>
                                {DIET_OPTIONS.map(d => <option key={d}>{d}</option>)}
                            </select>
                        </Field>
                    </Section>

                    {/* Child Health */}
                    <Section icon={Baby} title="Child Health Fields" color="bg-teal-600">
                        <Field label="Child Age (years)">
                            <input className="form-input" type="number" min="0" max="18" value={form.child_age || ''} onChange={e => set('child_age', e.target.value ? +e.target.value : null)} placeholder="e.g. 3" />
                        </Field>
                        <Field label="Child Weight (kg)">
                            <input className="form-input" type="number" min="0" value={form.child_weight || ''} onChange={e => set('child_weight', e.target.value ? +e.target.value : null)} placeholder="e.g. 12.5" />
                        </Field>
                        <Field label="Child Height (cm)">
                            <input className="form-input" type="number" min="0" value={form.child_height || ''} onChange={e => set('child_height', e.target.value ? +e.target.value : null)} placeholder="e.g. 95" />
                        </Field>
                        <Field label="Vaccination Status">
                            <select className="form-select" value={form.vaccination_status || ''} onChange={e => set('vaccination_status', e.target.value)}>
                                <option value="">Select status</option>
                                {VAX_OPTIONS.map(v => <option key={v}>{v}</option>)}
                            </select>
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
