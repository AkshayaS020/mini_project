import React from 'react';
import { User, Bell, Shield, Key, LogOut } from 'lucide-react';

export default function Settings() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h2>
                <p className="text-primary/70">Manage your account preferences</p>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="grid md:grid-cols-12 min-h-[500px]">
                    {/* Settings Sidebar */}
                    <div className="col-span-12 md:col-span-4 border-r border-slate-100 bg-slate-50/50 p-6 space-y-1">
                        <button className="w-full text-left px-4 py-3 rounded-xl bg-white shadow-sm border border-slate-200 font-medium text-primary flex items-center gap-3">
                            <User className="h-5 w-5" /> Profile
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-xl text-primary/70 hover:bg-slate-100 font-medium flex items-center gap-3 transition-colors">
                            <Bell className="h-5 w-5" /> Notifications
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-xl text-primary/70 hover:bg-slate-100 font-medium flex items-center gap-3 transition-colors">
                            <Shield className="h-5 w-5" /> Security
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-xl text-primary/70 hover:bg-slate-100 font-medium flex items-center gap-3 transition-colors">
                            <Key className="h-5 w-5" /> API Keys
                        </button>
                    </div>

                    {/* Content */}
                    <div className="col-span-12 md:col-span-8 p-8 space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Profile Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="h-24 w-24 rounded-full bg-slate-200 border-4 border-white shadow-lg"></div>
                                    <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
                                        Change Photo
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-primary/70">Full Name</label>
                                        <input type="text" defaultValue="Dr. John Smith" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-primary/70">Email Address</label>
                                        <input type="email" defaultValue="john.smith@medivoice.ai" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-primary/70">Specialty</label>
                                        <select className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                                            <option>General Practice</option>
                                            <option>Cardiology</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100 flex justify-end gap-3">
                            <button className="px-6 py-2 rounded-lg text-primary/70 font-medium hover:bg-slate-50">Cancel</button>
                            <button className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary shadow-md shadow-blue-500/20">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
