/**
 * Date formatting utilities
 */
import { Fixture } from '@/types';

/**
 * Group fixtures by their date
 * @param fixtures Array of fixtures to group
 * @returns Array of objects containing the date and matches for that date
 */
export const groupFixturesByDate = (fixtures: Fixture[]) => {
  const grouped = new Map<string, Fixture[]>();

  fixtures.forEach((fixture) => {
    const date = new Date(fixture.date).toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
    });

    if (!grouped.has(date)) {
      grouped.set(date, []);
    }
    grouped.get(date)!.push(fixture);
  });

  return Array.from(grouped.entries()).map(([date, matches]) => ({
    date,
    matches,
  }));
};

/**
 * Format a date string to a readable format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format a date string to show time only
 * @param dateString ISO date string
 * @returns Formatted time string
 */
export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Check if a date is in the past
 * @param dateString ISO date string
 * @returns true if the date is in the past
 */
export const isPastDate = (dateString: string): boolean => {
  return new Date(dateString) < new Date();
};

/**
 * Calculate time difference from now to a given date
 * @param dateString ISO date string
 * @returns Object with days, hours, minutes, and seconds until the date
 */
export const calculateTimeUntil = (dateString: string) => {
  const now = new Date().getTime();
  const target = new Date(dateString).getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};
