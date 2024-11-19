const msEquivalent = {
  // Short
  y: 31536000000,
  M: 2592000000,
  w: 604800000,
  d: 86400000,
  h: 3600000,
  m: 60000,
  s: 1000,
  ms: 1,
  // Long
  year: 31536000000,
  month: 2592000000,
  week: 604800000,
  day: 86400000,
  hour: 3600000,
  minute: 60000,
  second: 1000,
  millisecond: 1,
  // Plural
  years: 31536000000,
  months: 2592000000,
  weeks: 604800000,
  days: 86400000,
  hours: 3600000,
  minutes: 60000,
  seconds: 1000,
  milliseconds: 1,
};

/**
 * Checks if the current date is within a specified time range of another date.
 *
 * @param value - The amount of time units to check within.
 * @param unit - The unit of time to measure the range. Can be one of:
 *   - "y" or "year"
 *   - "M" or "month"
 *   - "w" or "week"
 *   - "d" or "day"
 *   - "h" or "hour"
 *   - "m" or "minute"
 *   - "s" or "second"
 *   - "ms" or "millisecond"
 * @param of - An object containing the date to compare against.
 * @returns `true` if the current date is within the specified range of the given date, otherwise `false`.
 */
Date.prototype.within = function (
  value: number,
  unit: Unit,
  { of = new Date() }: { of?: Date } = {}
): boolean {
  const ms = msEquivalent[unit];
  const diff = Math.abs(this.getTime() - of.getTime());
  return diff <= value * ms;
};
