
import React, { Component, ErrorInfo, ReactNode } from "react";
import { ErrorView } from "./ErrorView";

interface Props {
  children: ReactNode;
  FallbackComponent?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    
    // Send to analytics or error tracking service if available
    if (window.gtag) {
      window.gtag("event", "exception", {
        description: `${error.name}: ${error.message}`,
        fatal: true
      });
    }
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const { FallbackComponent = ErrorView } = this.props;
      return (
        <FallbackComponent 
          error={this.state.error as Error} 
          resetErrorBoundary={this.resetErrorBoundary} 
        />
      );
    }

    return this.props.children;
  }
}
