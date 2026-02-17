import React from 'react';
import { Users, FileText, Calendar, Activity, ArrowUpRight, Search, Filter } from 'lucide-react';

export default function DashboardPage() {
    // Mock Data for specific dashboard usage
    const stats = [
        { label: 'Total Patients', value: '1,284', icon: Users, change: '+12%', color: 'blue' },
        { label: 'Consultations', value: '84', icon: FileText, change: '+5%', color: 'green' },
        { label: 'Appointments', value: '12', icon: Calendar, change: '-2%', color: 'orange' },
        { label: 'Avg. Recovery', value: '98.5%', icon: Activity, change: '+0.4%', color: 'purple' },
    ];

    const recentConsultations = [
        { id: 1, patient: "Sarah Johnson", date: "Jan 26, 2024", doctor: "Dr. Smith", diagnosis: "Viral URI", status: "Completed" },
        { id: 2, patient: "Michael Chen", date: "Jan 25, 2024", doctor: "Dr. Smith", diagnosis: "Hypertension", status: "Review" },
        { id: 3, patient: "Emily Davis", date: "Jan 24, 2024", doctor: "Dr. Adams", diagnosis: "Routine Checkup", status: "Completed" },
        { id: 4, patient: "James Wilson", date: "Jan 23, 2024", doctor: "Dr. Smith", diagnosis: "Migraine", status: "Follow-up" },
        { id: 5, patient: "Robert Brown", date: "Jan 22, 2024", doctor: "Dr. Lee", diagnosis: "Back Pain", status: "Completed" },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'Review': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Follow-up': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h2>
                    <p className="text-slate-500">Welcome back, here's what's happening today.</p>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="glass-panel p-6 rounded-2xl flex items-start justify-between group hover:border-primary/30 transition-all hover:-translate-y-1">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full w-fit">
                                <ArrowUpRight className="h-3 w-3" /> {stat.change}
                            </div>
                        </div>
                        <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-200/60 shadow-xl shadow-slate-200/40">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" /> Recent Consultations
                    </h3>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search patients..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500">
                            <Filter className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient Name</th>
                                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Doctor</th>
                                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Diagnosis</th>
                                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {recentConsultations.map((item) => (
                                <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center font-bold text-xs ring-2 ring-white">
                                                {item.patient.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-slate-900">{item.patient}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3.5 w-3.5" /> {item.date}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-slate-600">{item.doctor}</td>
                                    <td className="py-4 px-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800">
                                            {item.diagnosis}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                                            <span className="relative flex h-2 w-2">
                                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${item.status === 'Completed' ? 'bg-green-400' : 'bg-orange-400'}`}></span>
                                                <span className={`relative inline-flex rounded-full h-2 w-2 ${item.status === 'Completed' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                            </span>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button className="text-sm font-medium text-primary hover:text-blue-700 hover:underline">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
