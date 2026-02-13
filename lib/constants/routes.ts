/**
 * Application route constants
 */

export const ROUTES = {
  home: '/',
  login: '/login',
  standings: '/standings',
  api: {
    cron: '/api/cron',
  },
} as const;

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = [ROUTES.login] as const;
