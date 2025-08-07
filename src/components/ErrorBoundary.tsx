import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 m-5 rounded-lg">
          <h2 className="text-red-600 dark:text-red-400 text-xl font-semibold mb-3">Something went wrong!</h2>
          <details className="whitespace-pre-wrap mt-3 font-mono text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
            <summary className="cursor-pointer text-gray-700 dark:text-gray-300 mb-2">Error Details</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.error && this.state.error.stack}
          </details>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white border-none rounded cursor-pointer text-sm transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
