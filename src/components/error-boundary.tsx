'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

import { ErrorState } from './error-state';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorState
          title='Something went wrong'
          description='An unexpected error occurred in this section.'
          action={{ label: 'Try again', onClick: () => this.setState({ hasError: false, error: null }) }}
        />
      );
    }

    return this.props.children;
  }
}
