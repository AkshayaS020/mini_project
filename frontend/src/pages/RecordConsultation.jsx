import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, CheckCircle, AlertCircle, Play, Pause } from 'lucide-react';

export default function RecordConsultation({ user }) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [duration, setDuration] = useState(0);
    const [report, setReport] = useState(null);
    const [patientName, setPatientName] = useState('');
    const [error, setError] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);
    const streamRef = useRef(null);
    const audioRef = useRef(null);

    // Timer logic
    useEffect(() => {
        if (isRecording) {
            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 100);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isRecording]);

    const startRecording = async () => {
        try {
            setError(null);
            setReport(null);
            setDuration(0);
            setAudioBlob(null);
            setAudioUrl(null);
            setIsPlaying(false);
            audioChunksRef.current = [];

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            });

            streamRef.current = stream;

            // Create MediaRecorder instance
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            mediaRecorderRef.current = mediaRecorder;

            // Collect audio data
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            // Handle recording stop
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

                // Store audio blob and create URL for playback
                setAudioBlob(audioBlob);
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);

                handleProcess(audioBlob);

                // Stop all tracks
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                }
            };

            // Start recording
            mediaRecorder.start();
            setIsRecording(true);

        } catch (err) {
            console.error('Error accessing microphone:', err);
            setError('Failed to access microphone. Please grant permission and try again.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const toggleRecording = () => {
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    };

    const handleProcess = async (audioBlob) => {
        setIsProcessing(true);
        setError(null);

        try {
            // Create FormData to send audio file
            const formData = new FormData();
            formData.append('audio_file', audioBlob, 'recording.webm');
            formData.append('patient_name', patientName || 'Anonymous');

            const response = await fetch(`http://localhost:8000/consultations/process/${patientName || 'Anonymous'}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                body: formData
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Failed to process consultation');
            }

            const data = await response.json();
            setReport(data);

        } catch (error) {
            console.error('Processing error:', error);
            setError(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const formatTime = (deciseconds) => {
        const totalSeconds = Math.floor(deciseconds / 10);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const togglePlayback = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    // Handle audio ended event
    useEffect(() => {
        if (audioRef.current) {
            const handleEnded = () => setIsPlaying(false);
            audioRef.current.addEventListener('ended', handleEnded);
            return () => {
                if (audioRef.current) {
                    audioRef.current.removeEventListener('ended', handleEnded);
                }
            };
        }
    }, [audioUrl]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">New Consultation</h2>
                <p className="text-slate-500">Record conversation to generate a clinical summary</p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-100">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            <div className="glass-panel text-center space-y-10 py-16 px-8 relative overflow-hidden rounded-3xl border border-white/20 shadow-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50"></div>

                <input
                    type="text"
                    placeholder="Patient Name"
                    className="px-6 py-4 border-none bg-slate-50 rounded-full w-full max-w-sm mx-auto block text-center text-lg font-medium focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all placeholder:text-slate-400 shadow-inner"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    disabled={isRecording}
                />

                <div className="relative inline-block">
                    {isRecording && (
                        <>
                            <span className="absolute -top-16 left-1/2 -translate-x-1/2 text-red-500 font-mono text-xl font-bold animate-pulse tracking-widest">
                                {formatTime(duration)}
                            </span>
                            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
                            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20 animation-delay-500"></div>
                        </>
                    )}

                    <button
                        onClick={toggleRecording}
                        disabled={isProcessing}
                        className={`w-36 h-36 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl relative z-10 ${isRecording
                            ? 'bg-red-500 hover:bg-red-600 scale-110 shadow-red-500/50'
                            : 'bg-gradient-to-br from-primary to-blue-600 hover:scale-105 hover:shadow-blue-500/50'
                            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isRecording ? (
                            <Square className="h-14 w-14 text-white fill-current" />
                        ) : (
                            <Mic className="h-16 w-16 text-white" />
                        )}
                    </button>
                </div>

                <p className={`text-sm font-medium transition-colors uppercase tracking-wide ${isRecording ? 'text-red-500' : 'text-slate-400'}`}>
                    {isRecording ? "Tap to stop & process" : "Tap microphone to start recording"}
                </p>
            </div>

            {/* Audio Player */}
            {audioUrl && (
                <div className="glass-panel p-6 rounded-2xl text-center space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={togglePlayback}
                            className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:scale-105"
                        >
                            {isPlaying ? (
                                <Pause className="h-8 w-8 text-white fill-current" />
                            ) : (
                                <Play className="h-8 w-8 text-white fill-current ml-1" />
                            )}
                        </button>
                        <div className="text-left">
                            <p className="text-sm font-bold text-slate-700">Recording Available</p>
                            <p className="text-xs text-slate-500">Click to {isPlaying ? 'pause' : 'play'} audio</p>
                        </div>
                    </div>
                    <audio ref={audioRef} src={audioUrl} className="hidden" />
                </div>
            )}

            {isProcessing && (
                <div className="glass-panel p-8 rounded-2xl text-center space-y-4 animate-in fade-in">
                    <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
                    <p className="text-slate-600 font-medium">Processing consultation audio...</p>
                </div>
            )}

            {report && (
                <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-xl border border-green-100">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Consultation Processed Successfully</span>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-blue-500 shadow-md">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Subjective</h3>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{report.subjective}</p>
                        </div>
                        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-purple-500 shadow-md">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Objective</h3>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{report.objective}</p>
                        </div>
                        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-orange-500 shadow-md">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Assessment</h3>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{report.assessment}</p>
                        </div>
                        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-green-500 shadow-md">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Plan</h3>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{report.plan}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
