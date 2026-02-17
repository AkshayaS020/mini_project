import React from 'react';
import { FileText, Calendar, User } from 'lucide-react';

export default function ReportView() {
    // Mock Data
    const reports = [
        { id: 1, date: "2024-01-20", doctor: "Dr. Smith", diagnosis: "Viral URI", status: "Finalized" },
        { id: 2, date: "2023-12-15", doctor: "Dr. Adams", diagnosis: "Routine Checkup", status: "Finalized" }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Medical Reports</h2>
                    <p className="text-slate-500">Access and review past consultation reports</p>
                </div>

                <div className="flex items-center gap-2">
                    <select className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 outline-none">
                        <option>All Reports</option>
                        <option>Recent</option>
                        <option>Finalized</option>
                    </select>
                </div>
            </div>

            <div className="grid gap-4">
                {reports.map((report) => (
                    <div key={report.id} className="glass-panel rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-between group border-l-4 border-l-transparent hover:border-l-primary hover:-translate-y-1">
                        <div className="flex items-center gap-5">
                            <div className="h-14 w-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <FileText className="h-7 w-7" />
                            </div>
                            <div className="space-y-1.5">
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{report.diagnosis}</h3>
                                <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                                    <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md"><Calendar className="h-3.5 w-3.5" /> {report.date}</span>
                                    <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {report.doctor}</span>
                                </div>
                            </div>
                        </div>

                        <span className="px-4 py-1.5 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide rounded-full border border-green-200 shadow-sm">
                            {report.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
