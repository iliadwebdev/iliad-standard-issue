/**
 * Extends the Array prototype to check if it includes all elements of another array.
 * @param arr - The array to check against.
 * @returns A boolean indicating whether the array includes all elements of the given array.
 */
Array.prototype.includesAll = function (arr: Array<any>) {
  return this.every((i) => arr.includes(i));
};

/**
 * Extends the Array prototype to check if it includes any element of another array.
 * @param arr - The array to check against.
 * @returns A boolean indicating whether the array includes any element of the given array.
 */
Array.prototype.includesAny = function (arr: Array<any>) {
  return this.some((i) => arr.includes(i));
};

/**
 * Extends the Array prototype to randomize the order of its elements.
 * @returns The array with its elements randomized.
 */
Array.prototype.randomize = function () {
  let _this = this;
  for (let i = _this.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [_this[i], _this[j]] = [_this[j], _this[i]];
  }

  this.splice(0, _this.length, ..._this);
  return _this;
};

Array.prototype.getByWrappedIndex = function (index: number) {
  return this[index % this.length];
};

Array.prototype.last = function () {
  return this[this.length - 1];
};

// Static version of randomize
Array.randomize = function (arr: Array<any>) {
  return arr.randomize();
};

/**
 * Creates a new array with the specified length and optional value for each element.
 * @param length The length of the new array.
 * @param value The optional value to fill the array with. If not provided, the index of each element will be used.
 * @returns A new array with the specified length and optional value for each element.
 */
Array.ofLength = function (length: number, value?: any) {
  return Array.from({ length })
    .fill(null)
    .map((_, idx) => value || idx);
};

Array.empty = function (length: number) {
  return Array.from({ length }).fill(null);
};

// STRING
String.prototype.words = function () {
  return this.split(/\s+/);
};

String.prototype.hash64 = function (seed: number = 0): string {
  const str = `${this}`;

  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return `${4294967296 * (2097151 & h2) + (h1 >>> 0)}`;
};

String.hash64 = function (str, seed: number = 0): string {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return `${4294967296 * (2097151 & h2) + (h1 >>> 0)}`;
};

String.words = function (str: string) {
  return str.words();
};

// MATH
Math.clamp = function (
  min: number,
  preferredValue: number,
  max: number
): number {
  return Math.min(Math.max(preferredValue, min), max);
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
