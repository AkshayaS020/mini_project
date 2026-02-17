import React, { useState } from 'react';
import { X, Play, Pause, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';

export default function DemoModal({ isOpen, onClose }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const demoSteps = [
        {
            title: "Welcome to the AI Consultation System",
            description: "This interactive demo will show you how our AI-powered medical consultation system works.",
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
            details: [
                "Record real consultations using your microphone",
                "AI automatically transcribes and analyzes the conversation",
                "Generate professional SOAP notes in seconds",
                "Secure, HIPAA-compliant data handling"
            ]
        },
        {
            title: "Step 1: Login to Your Account",
            description: "Secure authentication with role-based access control.",
            image: "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&h=600&fit=crop",
            details: [
                "Doctor and Patient roles available",
                "JWT-based secure authentication",
                "Test credentials: doctor1 / password123",
                "Protected routes and API endpoints"
            ]
        },
        {
            title: "Step 2: Start Recording Consultation",
            description: "Click the microphone button to begin recording the doctor-patient conversation.",
            image: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=800&h=600&fit=crop",
            details: [
                "Real-time audio capture from microphone",
                "Visual feedback during recording",
                "Timer shows recording duration",
                "High-quality audio encoding (WebM format)"
            ]
        },
        {
            title: "Step 3: AI Transcription",
            description: "Our system uses Google Speech Recognition to convert audio to text.",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
            details: [
                "Automatic speech-to-text conversion",
                "Supports multiple audio formats",
                "Noise cancellation and echo suppression",
                "Accurate medical terminology recognition"
            ]
        },
        {
            title: "Step 4: AI Analysis with Google Gemini",
            description: "Advanced AI extracts structured information from the consultation transcript.",
            image: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=800&h=600&fit=crop",
            details: [
                "Extracts patient complaints and symptoms",
                "Identifies medical history and context",
                "Captures doctor's observations",
                "Organizes treatment recommendations",
                "NO fabrication - only actual audio content"
            ]
        },
        {
            title: "Step 5: SOAP Note Generation",
            description: "Automatically generates a professional medical report in SOAP format.",
            image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&h=600&fit=crop",
            details: [
                "Subjective: Patient's complaints and history",
                "Objective: Doctor's examination findings",
                "Assessment: Clinical evaluation",
                "Plan: Treatment and follow-up instructions",
                "Includes full transcription for reference"
            ]
        },
        {
            title: "Step 6: Review and Playback",
            description: "Review the generated report and listen to the original recording.",
            image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop",
            details: [
                "View structured SOAP note",
                "Play back original audio recording",
                "Export or print reports",
                "Secure storage of consultation data",
                "Easy access to patient history"
            ]
        }
    ];

    const nextStep = () => {
        if (currentStep < demoSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const resetDemo = () => {
        setCurrentStep(0);
        setIsPlaying(false);
    };

    if (!isOpen) return null;

    const step = demoSteps[currentStep];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all hover:scale-110"
                >
                    <X className="h-6 w-6 text-slate-700" />
                </button>

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                        style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
                    />
                </div>

                <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
                    {/* Left Side - Image/Visual */}
                    <div className="lg:w-1/2 bg-gradient-to-br from-blue-50 to-purple-50 p-8 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-accent/5" />

                        <div className="relative z-10 w-full">
                            <img
                                src={step.image}
                                alt={step.title}
                                className="w-full h-64 lg:h-96 object-cover rounded-2xl shadow-2xl"
                            />

                            {/* Step Number Badge */}
                            <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">{currentStep + 1}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between overflow-y-auto">
                        <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                                    Step {currentStep + 1} of {demoSteps.length}
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                                    {step.title}
                                </h2>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                            {/* Details List */}
                            <div className="space-y-3">
                                {step.details.map((detail, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 animate-in slide-in-from-right duration-500"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="mt-1 w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent flex-shrink-0" />
                                        <p className="text-slate-700">{detail}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Call to Action */}
                            {currentStep === demoSteps.length - 1 && (
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-primary/20">
                                    <h3 className="font-bold text-slate-900 mb-2">Ready to get started?</h3>
                                    <p className="text-slate-600 text-sm mb-4">
                                        Login with <span className="font-mono bg-white px-2 py-1 rounded">doctor1</span> /
                                        <span className="font-mono bg-white px-2 py-1 rounded ml-1">password123</span>
                                    </p>
                                    <button
                                        onClick={onClose}
                                        className="w-full bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                                    >
                                        Start Using the System →
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Navigation Controls */}
                        <div className="mt-8 pt-6 border-t border-slate-200">
                            <div className="flex items-center justify-between gap-4">
                                {/* Previous Button */}
                                <button
                                    onClick={prevStep}
                                    disabled={currentStep === 0}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${currentStep === 0
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105'
                                        }`}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                    Previous
                                </button>

                                {/* Step Indicators */}
                                <div className="flex gap-2">
                                    {demoSteps.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentStep(index)}
                                            className={`w-2 h-2 rounded-full transition-all ${index === currentStep
                                                    ? 'w-8 bg-gradient-to-r from-primary to-accent'
                                                    : 'bg-slate-300 hover:bg-slate-400'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Next/Restart Button */}
                                {currentStep === demoSteps.length - 1 ? (
                                    <button
                                        onClick={resetDemo}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent text-white hover:scale-105 transition-all shadow-lg"
                                    >
                                        <RotateCcw className="h-5 w-5" />
                                        Restart Demo
                                    </button>
                                ) : (
                                    <button
                                        onClick={nextStep}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent text-white hover:scale-105 transition-all shadow-lg"
                                    >
                                        Next
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
