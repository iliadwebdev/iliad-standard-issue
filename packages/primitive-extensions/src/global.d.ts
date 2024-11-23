export {};

declare global {
  type Unit = (
    | "y"
    | "M"
    | "w"
    | "d"
    | "h"
    | "m"
    | "s"
    | "ms"
    | "year"
    | "month"
    | "week"
    | "day"
    | "hour"
    | "minute"
    | "second"
    | "millisecond"
    | "years"
    | "months"
    | "weeks"
    | "days"
    | "hours"
    | "minutes"
    | "seconds"
    | "milliseconds"
  ) & {};

  interface Array<T> {
    insertAtIndex(index: number, element: T): Array<T>;
    randomize(seed?: string | number): Array<T>;
    includesAll(arr: Array<T>): boolean;
    includesAny(arr: Array<T>): boolean;
    getByWrappedIndex(index: number): T;
    last(): T;
  }

  interface ArrayConstructor {
    randomize(arr: Array<any>, seed?: string | number): Array<any>;
    ofLength(length: number, value?: any): Array<any>;
    empty(length: number): Array<any>;
  }

  interface String {
    hash64(seed?: number): string;
    words(): Array<string>;
  }

  interface StringConstructor {
    hash64(str: string, seed?: number): string;
    words(str: string): Array<string>;
  }

  interface Math {
    clamp(min: number, preferredValue: number, max: number): number;
    mapRange(
      value: number,
      fromLow: number,
      fromHigh: number,
      toLow: number,
      toHigh: number
    ): number;
    invertPercentage(percentage: number, limit: number): number;
    randomInRange(min: number, max: number): number;
    falsyNotZero(value: any): boolean;
    seededRandomInRange(min: number, max: number, seed: number): number;
    seededRandom(seed: number): number;
  }

  interface Date {
    within(value: number, unit: Unit, { of }?: { of?: Date }): boolean;
  }
}

export {};
