import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="max-w-md mx-auto text-center py-20 px-4">
          <div className="bg-bg-secondary rounded-2xl shadow-lg p-8 border border-danger/30">
            <AlertTriangle className="w-16 h-16 text-danger mb-6 mx-auto" />
            <h2 className="text-2xl font-bold text-text-primary mb-4">Something went wrong</h2>
            <p className="text-text-muted mb-8 text-sm leading-relaxed">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>
            <button 
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-bold text-white bg-primary hover:bg-primary-dark transition-all shadow-sm w-full sm:w-auto"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
