import React, { useState, useEffect, useRef } from 'react';
import {
    FileText, Calendar, User, Stethoscope, Activity, Pill,
    ChevronDown, ChevronUp, Download, Search, MessageCircle,
    AlertCircle, Loader2, ArrowLeft
} from 'lucide-react';

const API = 'http://localhost:8000';

function DialogueSection({ items, color, icon: Icon, title }) {
    if (!items || items.length === 0) return null;
    return (
        <div className={`card p-4 border-l-4 ${color}`}>
            <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4 text-primary/70" />
                <p className="text-sm font-semibold text-primary/70">{title}</p>
            </div>
            <ul className="space-y-1">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-primary/70">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ReportDetail({ report, onBack }) {
    const printRef = useRef(null);

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = `
            <style>
                body { font-family: 'Inter', Arial, sans-serif; padding: 24px; color: #1e293b; }
                h1 { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
                h2 { font-size: 14px; font-weight: 700; margin: 16px 0 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
                .meta { color: #64748b; font-size: 13px; margin-bottom: 16px; }
                .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
                .card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; }
                .card-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; margin-bottom: 6px; }
                .card-body { font-size: 13px; line-height: 1.6; color: #334155; white-space: pre-wrap; }
                ul { list-style: disc; padding-left: 16px; margin: 0; }
                li { font-size: 13px; margin-bottom: 2px; }
                .bl-blue   { border-left: 4px solid #3b82f6; }
                .bl-teal   { border-left: 4px solid #14b8a6; }
                .bl-orange { border-left: 4px solid #f97316; }
                .bl-green  { border-left: 4px solid #10b981; }
            </style>
            ${printContents}
        `;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    const fmtDate = (iso) => {
        try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
        catch { return iso; }
    };

    return (
        <div className="space-y-5 animate-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="btn-secondary gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Reports
                </button>
                <button onClick={handlePrint} className="btn-teal gap-2 no-print">
                    <Download className="h-4 w-4" /> Download PDF
                </button>
            </div>

            {/* Printable report */}
            <div ref={printRef}>
                {/* Title Block */}
                <div className="card p-6 mb-5">
                    <h1 className="text-xl font-bold text-slate-900 mb-1">Patient Consultation Report</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-primary/70 mt-3">
                        <span className="flex items-center gap-1.5">
                            <User className="h-4 w-4" />
                            <strong>Patient:</strong> {report.patient_name || '—'}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Stethoscope className="h-4 w-4" />
                            <strong>Doctor:</strong> {report.doctor_username ? `Dr. ${report.doctor_username}` : '—'}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <strong>Date:</strong> {fmtDate(report.created_at)}
                        </span>
                    </div>
                </div>

                {/* Structured Dialogue */}
                {(report.patient_said?.length > 0 || report.doctor_said?.length > 0 ||
                    report.symptoms?.length > 0 || report.doctor_advice?.length > 0) && (
                        <div className="card p-6 mb-5">
                            <h2 className="font-bold text-primary/70 flex items-center gap-2 mb-4">
                                <MessageCircle className="h-5 w-5 text-primary" /> Consultation Record
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DialogueSection items={report.patient_said} color="border-blue-400" icon={User} title="Patient Said" />
                                <DialogueSection items={report.doctor_said} color="border-accent" icon={Stethoscope} title="Doctor Said" />
                                <DialogueSection items={report.symptoms} color="border-orange-400" icon={Activity} title="Symptoms Identified" />
                                <DialogueSection items={report.doctor_advice} color="border-emerald-400" icon={Pill} title="Doctor's Advice & Recommendations" />
                            </div>
                        </div>
                    )}

                {/* SOAP Note */}
                <div className="card p-6 mb-5">
                    <h2 className="font-bold text-primary/70 flex items-center gap-2 mb-4">
                        <Activity className="h-5 w-5 text-accent" /> SOAP Note
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: 'Subjective', content: report.subjective, color: 'border-l-4 border-primary' },
                            { label: 'Objective', content: report.objective, color: 'border-l-4 border-accent' },
                            { label: 'Assessment', content: report.assessment, color: 'border-l-4 border-orange-500' },
                            { label: 'Plan', content: report.plan, color: 'border-l-4 border-emerald-500' },
                        ].map(({ label, content, color }) => (
                            <div key={label} className={`card p-4 ${color}`}>
                                <p className="section-title">{label}</p>
                                <p className="text-sm text-primary/70 leading-relaxed whitespace-pre-wrap">{content || '—'}</p>
                            </div>
                        ))}
                    </div>
                    {report.additional_notes && (
                        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="section-title">Additional Notes</p>
                            <p className="text-sm text-primary/70">{report.additional_notes}</p>
                        </div>
                    )}
                </div>

                {/* Full Transcription */}
                {report.full_transcription && (
                    <div className="card p-6">
                        <h2 className="font-bold text-primary/70 mb-3">Full Transcription</h2>
                        <p className="text-sm text-primary/70 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100">
                            {report.full_transcription}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ReportView({ user }) {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);

    useEffect(() => { fetchReports(); }, []);

    async function fetchReports() {
        setLoading(true);
        try {
            const res = await fetch(`${API}/consultations`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (!res.ok) throw new Error('Failed to load reports');
            setReports(await res.json());
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    const fmtDate = (iso) => {
        try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
        catch { return iso; }
    };

    const filtered = reports.filter(r =>
        (r.patient_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.doctor_username || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.assessment || '').toLowerCase().includes(search.toLowerCase())
    );

    if (selected) return <ReportDetail report={selected} onBack={() => setSelected(null)} user={user} />;

    return (
        <div className="space-y-6 animate-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Consultation Reports</h2>
                    <p className="text-primary/70 text-sm mt-1">
                        {reports.length} report{reports.length !== 1 ? 's' : ''} found
                    </p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/70" />
                    <input
                        type="text"
                        placeholder="Search patients, doctors…"
                        className="form-input pl-9 text-sm"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* States */}
            {loading && (
                <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    <AlertCircle className="h-4 w-4" /> {error}
                </div>
            )}
            {!loading && !error && filtered.length === 0 && (
                <div className="card p-12 text-center">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-semibold text-primary/70">No reports found</p>
                    <p className="text-sm text-primary/70 mt-1">
                        {reports.length === 0
                            ? 'Record a consultation to generate your first report.'
                            : 'Try adjusting your search term.'}
                    </p>
                </div>
            )}

            {/* Report Cards */}
            {!loading && !error && (
                <div className="grid gap-4">
                    {filtered.map((report) => (
                        <button
                            key={report.id}
                            onClick={() => setSelected(report)}
                            className="card p-5 w-full text-left hover:shadow-md hover:-translate-y-0.5
                                       transition-all duration-200 border-l-4 border-l-blue-500 group"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                                            {report.patient_name || 'Unknown Patient'}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-3 mt-1">
                                            <span className="flex items-center gap-1 text-xs text-primary/70">
                                                <Stethoscope className="h-3 w-3" />
                                                Dr. {report.doctor_username || '—'}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-primary/70">
                                                <Calendar className="h-3 w-3" />
                                                {fmtDate(report.created_at)}
                                            </span>
                                            {report.symptoms?.length > 0 && (
                                                <span className="flex items-center gap-1 text-xs text-primary/70">
                                                    <Activity className="h-3 w-3" />
                                                    {report.symptoms.length} symptom{report.symptoms.length !== 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>
                                        {report.assessment && (
                                            <p className="text-xs text-primary/70 mt-1 line-clamp-1">
                                                <span className="font-medium text-primary/70">Assessment:</span> {report.assessment}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <span className="badge-blue hidden sm:inline-flex flex-shrink-0">View Report</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
