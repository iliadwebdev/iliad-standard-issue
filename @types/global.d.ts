declare global {
  interface Array<T> {
    getByWrappedIndex(index: number): T;
    includesAll(arr: Array): boolean;
    includesAny(arr: Array): boolean;
    randomize(): Array<T>;
    last(): T;
  }

  interface ArrayConstructor {
    ofLength(length: number, value?: any): Array<any>;
    randomize(arr: Array<any>): Array<any>;
    empty(length: number): Array<any>;
  }

  interface String {
    words(): Array<string>;
    hash64(seed: number = 0): string;
  }

  interface StringConstructor {
    words(str: string): Array<string>;
    hash64(str: string, seed: number = 0): string;
  }

  interface Math {
    clamp(min: number, preferredValue: number, max: number): number;
    mapRange(
      value: number,
      fromLow: number,
      fromHigh: number,
      toLow: number = 0,
      toHigh: number = 100
    ): number;
  }
}
// Add randomize as a static method to Array

export {};
