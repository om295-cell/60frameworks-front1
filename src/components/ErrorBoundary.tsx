import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in UI:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            backgroundColor: '#F8F9FA',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: '#242424' }}>
            Application Encountered an Issue
          </h2>
          <p style={{ color: '#5F6368', maxWidth: '500px', marginBottom: '2rem' }}>
            We've logged the incident and our engineering team is actively looking into it.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#F68621',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.85rem 2rem',
              borderRadius: '9999px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
