import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowRight, Activity } from 'lucide-react';
import DemoModal from '../components/DemoModal';

export default function LandingPage() {
    const navigate = useNavigate();
    const [showDemo, setShowDemo] = useState(false);

    return (
        <div className="relative min-h-[calc(100vh-5rem)] flex items-center overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-blue-50 to-transparent"></div>
            <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
            <div className="absolute bottom-20 right-1/3 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Side - Content */}
                <div className="space-y-8 animate-in slide-in-from-left duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary text-sm font-medium">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        #1 Hospital Management System
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                        Hospital <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Management</span>
                    </h1>

                    <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
                        Optimizing Operations for Better Patient Care. Streamline your clinical workflow with our voice-driven AI assistant.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-gradient-to-r from-primary to-teal-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-105 transition-all text-lg flex items-center justify-center gap-2"
                        >
                            Get Started <ArrowRight className="h-5 w-5" />
                        </button>

                        <button
                            onClick={() => setShowDemo(true)}
                            className="px-8 py-4 rounded-full font-semibold text-slate-600 hover:bg-white/50 border border-transparent hover:border-slate-200 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
                        >
                            <Play className="h-5 w-5 fill-current" /> Watch Demo
                        </button>
                    </div>

                    {/* Pagination Dots decoration */}
                    <div className="flex gap-2 pt-8">
                        <div className="w-8 h-2 bg-primary rounded-full"></div>
                        <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                        <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                    </div>
                </div>

                {/* Right Side - Doctor Image & Cards */}
                <div className="relative animate-in slide-in-from-right duration-1000 hidden lg:block">
                    <div className="relative z-10">
                        {/* Placeholder for Doctor Image - In a real app, import an asset */}
                        <img
                            src="https://img.freepik.com/free-photo/portrait-smiling-handsome-male-doctor-man_171337-5055.jpg"
                            alt="Doctor"
                            className="w-auto h-[600px] object-cover rounded-none mx-auto drop-shadow-2xl mask-image-b"
                            style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
                        />

                        {/* Floating Glass Cards */}
                        <div className="absolute top-1/4 -left-12 glass-panel p-4 rounded-2xl animate-bounce duration-[3000ms] shadow-2xl">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                                    <Activity className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Patient Recovery</p>
                                    <p className="text-lg font-bold text-slate-900">98.5%</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-1/4 -right-8 glass-panel p-4 rounded-2xl animate-bounce duration-[4000ms] delay-700 shadow-2xl">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg text-primary">
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>
                                        <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"></div>
                                        <div className="w-6 h-6 rounded-full bg-slate-400 border-2 border-white"></div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Active Doctors</p>
                                    <p className="text-lg font-bold text-slate-900">250+</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Demo Modal */}
            <DemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
        </div>
    );
}
