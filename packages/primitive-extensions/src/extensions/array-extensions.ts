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
Array.prototype.randomize = function (seed?: number | string): Array<any> {
  if (
    typeof window !== "undefined" &&
    !seed &&
    process.env.NODE_ENV === "development"
  ) {
    console.warn(
      `[Iliad] Array.randomize is called in the browser without a seed. This can lead to inconsistencies between server rendered and client rendering, and can also cause a new random order on every render. \n If this is desired behavior, please supply a randomly generated seed to the function or use the experimental useDeterministicRandom hook.`
    );
  }
  let _seed =
    typeof seed === "number"
      ? seed
      : seed
        ? seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
        : Date.now() * Math.random();

  let _this = this;

  for (let i = _this.length - 1; i > 0; i--) {
    const j = Math.floor(Math.seededRandom(_seed) * (i + 1));
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

Array.prototype.insertAtIndex = function (index: number, element: any) {
  this.splice(index, 0, element);
  return this;
};

// Static version of randomize
Array.randomize = function (arr: Array<any>, seed?: number | string) {
  return arr.randomize(seed);
};

// Gets all unique values in an array, accepts a custom equality function
Array.prototype.unique = function (equalityFunction?: Function) {
  const eqf = equalityFunction || ((a: unknown, b: unknown) => a === b);
  let result: Array<any> = [];

  for (let i = 0; i < this.length; i++) {
    let current = this[i];
    if (!result.some((el) => eqf(el, current))) {
      result.push(current);
    }
  }

  return result;
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

// Static version of Array.unique
Array.unique = function (arr: Array<any>, equalityFunction?: Function) {
  return arr.unique(equalityFunction);
};
