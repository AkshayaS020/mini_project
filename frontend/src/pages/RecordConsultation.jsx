import React, { useState, useEffect, useRef } from 'react';
import {
    Mic, Square, Loader2, CheckCircle, AlertCircle,
    Play, Pause, User, Stethoscope, Activity, Pill, MessageCircle
} from 'lucide-react';

const API = 'http://localhost:8000';

function DialogueBubble({ items, color, icon: Icon, title }) {
    if (!items || items.length === 0) return null;
    return (
        <div className={`card p-5 border-l-4 ${color}`}>
            <div className="flex items-center gap-2 mb-3">
                <Icon className="h-4 w-4 text-primary/70" />
                <h4 className="text-sm font-semibold text-primary/70">{title}</h4>
            </div>
            <ul className="space-y-1.5">
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

function SoapCard({ title, content, color, className = '' }) {
    return (
        <div className={`card p-5 border-l-4 ${color} ${className}`}>
            <p className="section-title">{title}</p>
            <p className="text-sm text-primary/70 leading-relaxed whitespace-pre-wrap">{content || '—'}</p>
        </div>
    );
}

export default function RecordConsultation({ user }) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [duration, setDuration] = useState(0);
    const [report, setReport] = useState(null);
    const [patientName, setPatientName] = useState('');
    const [error, setError] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);
    const streamRef = useRef(null);
    const audioRef = useRef(null);

    // Timer
    useEffect(() => {
        if (isRecording) {
            timerRef.current = setInterval(() => setDuration(p => p + 1), 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isRecording]);

    const startRecording = async () => {
        try {
            setError(null); setReport(null); setDuration(0);
            setAudioUrl(null); setIsPlaying(false);
            audioChunksRef.current = [];

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 }
            });
            streamRef.current = stream;

            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioUrl(URL.createObjectURL(blob));
                handleProcess(blob);
                streamRef.current?.getTracks().forEach(t => t.stop());
            };
            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            setError('Failed to access microphone. Please grant permission and try again.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current?.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleProcess = async (blob) => {
        setIsProcessing(true); setError(null);
        try {
            const formData = new FormData();
            formData.append('audio_file', blob, 'recording.webm');
            const name = patientName.trim() || 'Anonymous';
            const res = await fetch(`${API}/consultations/process/${encodeURIComponent(name)}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${user.token}` },
                body: formData
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Failed to process consultation');
            }
            setReport(await res.json());
        } catch (e) {
            setError(e.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const formatTime = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const togglePlayback = () => {
        if (!audioRef.current) return;
        if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
        else { audioRef.current.play(); setIsPlaying(true); }
    };

    useEffect(() => {
        const el = audioRef.current;
        const onEnd = () => setIsPlaying(false);
        el?.addEventListener('ended', onEnd);
        return () => el?.removeEventListener('ended', onEnd);
    }, [audioUrl]);

    return (
        <div className="space-y-6 animate-in">
            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">New Consultation</h2>
                <p className="text-primary/70 text-sm mt-1">Record a doctor-patient conversation and generate an AI-powered clinical report</p>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
                </div>
            )}

            {/* Recording Card */}
            <div className="card p-8 text-center relative overflow-hidden">
                {/* Decorative gradient bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-teal-400 to-emerald-500" />

                {/* Patient Name Input */}
                <div className="mb-8">
                    <label className="form-label text-center block">Patient Name</label>
                    <input
                        type="text"
                        placeholder="Enter patient name…"
                        className="form-input max-w-sm mx-auto text-center"
                        value={patientName}
                        onChange={e => setPatientName(e.target.value)}
                        disabled={isRecording}
                    />
                </div>

                {/* Mic Button */}
                <div className="relative inline-flex items-center justify-center mb-6">
                    {isRecording && (
                        <>
                            <span className="absolute h-36 w-36 rounded-full bg-red-400/20 pulse-ring" />
                            <span className="absolute h-44 w-44 rounded-full bg-red-400/10 pulse-ring animation-delay-400" />
                        </>
                    )}
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isProcessing}
                        className={`relative z-10 h-28 w-28 rounded-full flex items-center justify-center
                                    transition-all duration-300 shadow-xl
                                    ${isRecording
                                ? 'bg-red-500 hover:bg-red-600 scale-105 shadow-red-400/40'
                                : 'bg-gradient-to-br from-primary to-accent hover:scale-105 shadow-blue-500/30'
                            }
                                    ${isProcessing ? 'opacity-50 cursor-not-allowed scale-100' : ''}`}
                    >
                        {isRecording
                            ? <Square className="h-12 w-12 text-white fill-current" />
                            : <Mic className="h-12 w-12 text-white" />
                        }
                    </button>
                </div>

                {/* Timer */}
                {isRecording && (
                    <p className="text-red-500 font-mono text-2xl font-bold mb-2 animate-pulse">
                        {formatTime(duration)}
                    </p>
                )}

                <p className={`text-xs font-semibold uppercase tracking-widest ${isRecording ? 'text-red-500' : 'text-primary/70'}`}>
                    {isRecording ? 'Tap to stop & process' : 'Tap microphone to start recording'}
                </p>
            </div>

            {/* Audio Playback */}
            {audioUrl && (
                <div className="card p-5 flex items-center gap-4 animate-in">
                    <button
                        onClick={togglePlayback}
                        className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600
                                   flex items-center justify-center shadow-lg shadow-purple-500/25
                                   hover:scale-105 transition-transform flex-shrink-0"
                    >
                        {isPlaying ? <Pause className="h-5 w-5 text-white fill-current" /> : <Play className="h-5 w-5 text-white fill-current ml-0.5" />}
                    </button>
                    <div>
                        <p className="text-sm font-semibold text-primary/70">Recording Ready</p>
                        <p className="text-xs text-primary/70">Duration: {formatTime(duration)}</p>
                    </div>
                    <audio ref={audioRef} src={audioUrl} className="hidden" />
                </div>
            )}

            {/* Processing State */}
            {isProcessing && (
                <div className="card p-8 text-center animate-in">
                    <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-3" />
                    <p className="font-semibold text-primary/70">Analysing consultation…</p>
                    <p className="text-sm text-primary/70 mt-1">Transcribing audio and extracting clinical insights</p>
                </div>
            )}

            {/* Report */}
            {report && (
                <div className="space-y-5 animate-in">
                    {/* Success Banner */}
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-semibold">Consultation processed successfully</span>
                        <span className="text-emerald-500 ml-1">— Patient: {report.patient_name || patientName}</span>
                    </div>

                    {/* Consultation Record — Structured Dialogue */}
                    <div className="card p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <MessageCircle className="h-5 w-5 text-primary" />
                            <h3 className="font-bold text-primary/70">Consultation Record</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DialogueBubble
                                items={report.patient_said}
                                color="border-blue-400"
                                icon={User}
                                title="Patient Said"
                            />
                            <DialogueBubble
                                items={report.doctor_said}
                                color="border-accent"
                                icon={Stethoscope}
                                title="Doctor Said"
                            />
                            <DialogueBubble
                                items={report.symptoms}
                                color="border-orange-400"
                                icon={Activity}
                                title="Symptoms Identified"
                            />
                            <DialogueBubble
                                items={report.doctor_advice}
                                color="border-emerald-400"
                                icon={Pill}
                                title="Doctor's Advice"
                            />
                        </div>
                    </div>

                    {/* SOAP Note */}
                    <div className="card p-6">
                        <h3 className="font-bold text-primary/70 mb-4 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-accent" /> SOAP Note
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SoapCard title="Subjective" content={report.subjective} color="border-primary" />
                            <SoapCard title="Objective" content={report.objective} color="border-accent" />
                            <SoapCard title="Assessment" content={report.assessment} color="border-orange-500" />
                            <SoapCard title="Plan" content={report.plan} color="border-emerald-500" />
                        </div>
                        {report.additional_notes && (
                            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="section-title">Additional Notes</p>
                                <p className="text-sm text-primary/70">{report.additional_notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
