import { Thoth } from "@classes/Thoth/server.ts";

// Define the mixin function
export function classWithThoth<T extends new (...args: any[]) => {}>(
  Base: T
): T & (new (...args: any[]) => Thoth) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args);
      Object.assign(this, new Thoth());
    }
  } as any;
}
