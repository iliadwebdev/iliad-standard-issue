// MATH
Math.clamp = function (
  min: number,
  preferredValue: number,
  max: number
): number {
  return Math.min(Math.max(preferredValue, min), max);
};

Math.seededRandom = function (seed: number): number {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// https://docs.arduino.cc/language-reference/en/functions/math/map/
Math.mapRange = function (
  value: number,
  fromLow: number,
  fromHigh: number,
  toLow: number = 0,
  toHigh: number = 100
): number {
  return ((value - fromLow) * (toHigh - toLow)) / (fromHigh - fromLow) + toLow;
};

Math.invertPercentage = function (
  percentage: number,
  limit: number = 100
): number {
  return Math.abs(percentage - limit);
};

Math.randomInRange = function (min: number, max: number): number {
  return Math.random() * (max - min) + min;
};

Math.seededRandomInRange = function (
  min: number,
  max: number,
  seed: number
): number {
  return Math.seededRandom(seed) * (max - min) + min;
};

/**
 * Checks if a value is falsy, excluding zero.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} - Returns true if the value is falsy (excluding zero), otherwise false.
 */
Math.falsyNotZero = function (value: any): boolean {
  if (value === 0) return false;
  return !value;
};
