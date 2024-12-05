import {
  ThothConfigInput,
  ThothConfigNormalized,
  ThothConfigStrict,
} from "./types.ts";

// Utils
import * as u1 from "./utils.ts";
import * as u0 from "@utils";
const u = { ...u0, ...u1 };

export class Configuration implements ThothConfigNormalized {
  configObject: ThothConfigNormalized;

  constructor(thothConfigObject: ThothConfigInput) {
    this.configObject = u.normalizeConfig(thothConfigObject);
  }

  get prefix() {
    return this.configObject.prefix;
  }

  get typeColors() {
    return this.configObject.typeColors;
  }

  get namespace(): string | null {
    const { name, color, fn, enabled } = this.prefix.namespace;
    return enabled ? fn(color(name)) : null;
  }

  get overrideConsole(): boolean {
    return this.configObject.overrideConsole;
  }

  get module(): string | null {
    const { name, color, fn, enabled } = this.prefix.module;
    return enabled ? fn(color(name)) : null;
  }
}
