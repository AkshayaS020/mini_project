import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6 border border-slate-100">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Something went wrong</h2>
                            <p className="text-primary/70 mt-2">The application encountered an unexpected error.</p>
                        </div>

                        {this.state.error && (
                            <div className="bg-slate-50 p-4 rounded-lg text-left overflow-auto max-h-40 border border-slate-200">
                                <p className="text-xs font-mono text-red-600 break-words">{this.state.error.toString()}</p>
                            </div>
                        )}

                        <button
                            onClick={this.handleReload}
                            className="w-full bg-primary hover:bg-primary text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                        >
                            <RefreshCcw className="h-4 w-4" /> Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
