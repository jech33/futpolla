import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const containerClassName = 'container mx-auto px-6';

export const specialCharsToSpace = (value: string): string => {
  return value.replace(/[-_]/g, ' ').toLowerCase();
};
