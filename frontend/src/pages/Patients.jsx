import React from 'react';
import { Search, Filter, MoreHorizontal, Mail, Phone, MapPin } from 'lucide-react';

export default function Patients() {
    const patients = [
        { id: 1, name: "Sarah Johnson", age: 34, gender: "Female", phone: "+1 (555) 123-4567", email: "sarah.j@example.com", status: "Active" },
        { id: 2, name: "Michael Chen", age: 45, gender: "Male", phone: "+1 (555) 987-6543", email: "m.chen@example.com", status: "Active" },
        { id: 3, name: "Emily Davis", age: 28, gender: "Female", phone: "+1 (555) 456-7890", email: "emily.d@example.com", status: "New" },
        { id: 4, name: "James Wilson", age: 52, gender: "Male", phone: "+1 (555) 789-0123", email: "j.wilson@example.com", status: "Inactive" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Patients</h2>
                    <p className="text-slate-500">Manage patient records and information</p>
                </div>

                <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-all">
                    + Add Patient
                </button>
            </div>

            {/* Filter Bar */}
            <div className="glass-panel p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search patients by name, email..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        <Filter className="h-4 w-4" /> Filter
                    </button>
                </div>
            </div>

            {/* Patients List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patients.map((patient) => (
                    <div key={patient.id} className="glass-panel p-6 rounded-2xl flex flex-col gap-4 group hover:border-primary/30 transition-all hover:-translate-y-1">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-600">
                                    {patient.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{patient.name}</h3>
                                    <p className="text-xs text-slate-400">{patient.age} yrs • {patient.gender}</p>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600">
                                <MoreHorizontal className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-2 pt-2">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Mail className="h-4 w-4" /> {patient.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Phone className="h-4 w-4" /> {patient.phone}
                            </div>
                        </div>

                        <div className="pt-2 mt-auto border-t border-slate-100 flex items-center justify-between">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${patient.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' :
                                    patient.status === 'New' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                        'bg-slate-50 text-slate-500 border-slate-100'
                                }`}>
                                {patient.status}
                            </span>
                            <button className="text-sm font-medium text-primary hover:underline">View Profile</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
