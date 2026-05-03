import React from 'react';

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
        <div className="container text-center py-5">
          <div className="card shadow-sm p-5 border-danger">
            <i className="bi bi-exclamation-triangle text-danger mb-3" style={{ fontSize: '3rem' }}></i>
            <h2 className="mb-4">Something went wrong</h2>
            <p className="text-muted mb-4">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
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
