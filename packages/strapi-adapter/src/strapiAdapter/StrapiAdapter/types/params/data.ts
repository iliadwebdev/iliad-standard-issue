import type { Common } from "@strapi/strapi";
import type * as AttributeUtils from "./attributes";
export type Input<TSchemaUID extends Common.UID.Schema> =
  AttributeUtils.GetValues<TSchemaUID>;
