// Base class to start with
class Base {}

// Type definition for a class constructor
type Constructor<T = {}> = new (...args: any[]) => T;

// Helper function to copy properties and methods from source to target
function copyProperties(target: any, source: any) {
  // Copy instance properties and methods
  Object.getOwnPropertyNames(source).forEach((key) => {
    if (key !== "constructor") {
      Object.defineProperty(
        target,
        key,
        Object.getOwnPropertyDescriptor(source, key)!
      );
    }
  });

  // Copy symbols, if any
  Object.getOwnPropertySymbols(source).forEach((sym) => {
    Object.defineProperty(
      target,
      sym,
      Object.getOwnPropertyDescriptor(source, sym)!
    );
  });
}

// Helper type to compute the intersection of instance types
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

// The Merged function that composes multiple mixins
export function Merged<BaseC extends Constructor, Mixins extends Constructor[]>(
  BaseClass: BaseC,
  ...mixins: Mixins
): Constructor<
  InstanceType<BaseC> & UnionToIntersection<InstanceType<Mixins[number]>>
> {
  return mixins.reduce((PrevClass, MixinClass) => {
    return class extends PrevClass {
      constructor(...args: any[]) {
        super(...args);
        const mixinInstance = new MixinClass(...args);
        copyProperties(this, mixinInstance);
      }
    };
  }, BaseClass) as any;
}

class BaseClass {}
export const MergedClass = (...args: any[]) => Merged(BaseClass, ...args);
