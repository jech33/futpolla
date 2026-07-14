/**
 * Error Boundary component to catch React errors and display fallback UI
 * Prevents the entire app from crashing when a component throws an error
 */

'use client';

import React from 'react';

import { logger } from '@/lib/logger';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to our logging service
    logger.error('React Error Boundary caught an error', {
      context: 'ErrorBoundary',
      data: { error, errorInfo },
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  override render() {
    if (this.state.hasError) {
      // Custom fallback UI or default error display
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
            <div className="mb-4 text-6xl">⚠️</div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Something went wrong</h2>
            <p className="mb-6 text-sm text-gray-600">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={this.handleReset}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
