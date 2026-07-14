/**
 * Logging utility for consistent logging across the application
 * In production, this can be extended to send logs to external services
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
  context?: string;
  data?: unknown;
}

/**
 * Format log message with context
 */
const formatMessage = (level: LogLevel, message: string, options?: LogOptions): string => {
  const timestamp = new Date().toISOString();
  const context = options?.context ? `[${options.context}]` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${context} ${message}`;
};

/**
 * Log info message
 */
export const logInfo = (message: string, options?: LogOptions): void => {
  const formattedMessage = formatMessage('info', message, options);
  console.log(formattedMessage, options?.data || '');
};

/**
 * Log warning message
 */
export const logWarn = (message: string, options?: LogOptions): void => {
  const formattedMessage = formatMessage('warn', message, options);
  console.warn(formattedMessage, options?.data || '');
};

/**
 * Log error message
 */
export const logError = (message: string, options?: LogOptions): void => {
  const formattedMessage = formatMessage('error', message, options);
  console.error(formattedMessage, options?.data || '');
};

/**
 * Log debug message (only in development)
 */
export const logDebug = (message: string, options?: LogOptions): void => {
  if (process.env.NODE_ENV === 'development') {
    const formattedMessage = formatMessage('debug', message, options);
    console.debug(formattedMessage, options?.data || '');
  }
};

/**
 * Logger object for convenient access to all logging functions
 */
export const logger = {
  info: logInfo,
  warn: logWarn,
  error: logError,
  debug: logDebug,
};
