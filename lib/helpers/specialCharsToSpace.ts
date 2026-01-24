export const specialCharsToSpace = (value: string): string => {
  return value.replace(/[-_]/g, ' ').toLowerCase();
};
