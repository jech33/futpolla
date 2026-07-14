/**
 * Error handling utilities for consistent error management across the application
 */

/**
 * Custom error class for Firestore-related errors
 */
export class FirestoreError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'FirestoreError';

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FirestoreError);
    }
  }
}

/**
 * Custom error class for API-related errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Handle Firestore errors with consistent logging and error transformation
 * @param error The caught error
 * @param context Description of where the error occurred
 * @throws FirestoreError
 */
export const handleFirestoreError = (error: unknown, context: string): never => {
  console.error(`[Firestore Error - ${context}]`, error);

  if (error instanceof FirestoreError) {
    throw error;
  }

  if (error instanceof Error) {
    throw new FirestoreError(`${context}: ${error.message}`, 'firestore/error', error);
  }

  throw new FirestoreError(`${context}: Unknown error occurred`, 'firestore/unknown', error);
};

/**
 * Handle API errors with consistent logging and error transformation
 * @param error The caught error
 * @param context Description of where the error occurred
 * @throws ApiError
 */
export const handleApiError = (error: unknown, context: string): never => {
  console.error(`[API Error - ${context}]`, error);

  if (error instanceof ApiError) {
    throw error;
  }

  if (error instanceof Error) {
    throw new ApiError(`${context}: ${error.message}`, 500, error);
  }

  throw new ApiError(`${context}: Unknown error occurred`, 500, error);
};

/**
 * Check if an error is a Firestore error
 */
export const isFirestoreError = (error: unknown): error is FirestoreError => {
  return error instanceof FirestoreError;
};

/**
 * Check if an error is an API error
 */
export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};
