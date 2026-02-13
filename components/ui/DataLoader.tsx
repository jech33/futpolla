/**
 * Reusable data loading component that handles loading, error, and empty states
 * Eliminates duplication across components that fetch data
 */

'use client';

import React from 'react';

import { Spinner } from '@/components/ui/Spinner';

interface DataLoaderProps<T> {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  data: T | undefined;
  children: (data: T) => React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: (error: Error) => React.ReactNode;
  emptyComponent?: React.ReactNode;
}

/**
 * DataLoader component with generic type support
 */
export function DataLoader<T>({
  isLoading,
  isError,
  error,
  data,
  children,
  loadingComponent,
  errorComponent,
  emptyComponent,
}: DataLoaderProps<T>) {
  // Loading state
  if (isLoading) {
    return (
      <>
        {loadingComponent || (
          <div className="flex justify-center py-12">
            <Spinner className="size-24 text-slate-300" />
          </div>
        )}
      </>
    );
  }

  // Error state
  if (isError && error) {
    return (
      <>
        {errorComponent ? (
          errorComponent(error)
        ) : (
          <div className="py-12 text-center text-red-500">
            <p className="text-lg font-semibold">Error</p>
            <p className="mt-2 text-sm">{error.message}</p>
          </div>
        )}
      </>
    );
  }

  // Empty/no data state
  if (!data) {
    return (
      <>
        {emptyComponent || (
          <div className="py-12 text-center text-gray-500">
            <p>No data available</p>
          </div>
        )}
      </>
    );
  }

  // Data loaded successfully - render children with data
  return <>{children(data)}</>;
}
