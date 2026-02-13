/**
 * Environment variable validation using Zod
 * This ensures all required environment variables are present and valid at runtime
 */
import { z } from 'zod';

const envSchema = z.object({
  // Client-side Firebase configuration (must have NEXT_PUBLIC_ prefix)
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, 'Firebase API key is required'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase auth domain is required'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase project ID is required'),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1, 'Firebase storage bucket is required'),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z
    .string()
    .min(1, 'Firebase messaging sender ID is required'),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, 'Firebase app ID is required'),

  // Server-side Firebase Admin configuration
  FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase admin project ID is required'),
  FIREBASE_CLIENT_EMAIL: z.string().email('Firebase client email must be valid'),
  FIREBASE_PRIVATE_KEY: z.string().min(1, 'Firebase private key is required'),

  // API keys and secrets
  CRON_SECRET: z.string().min(20, 'Cron secret must be at least 20 characters'),
  FOOTBALL_DATA_API_KEY: z.string().min(1, 'Football Data API key is required'),
});

/**
 * Validated environment variables
 * Throws an error if any required variable is missing or invalid
 */
export const env = envSchema.parse(process.env);

/**
 * Type-safe environment variables for client-side use
 */
export type Env = z.infer<typeof envSchema>;
