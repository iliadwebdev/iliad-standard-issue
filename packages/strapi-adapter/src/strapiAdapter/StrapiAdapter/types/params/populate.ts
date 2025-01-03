import type { Attribute, Common, Utils } from "@strapi/strapi";
import type { Params } from "./index";
/**
 * Wildcard notation for populate
 *
 * To populate all the root level relations
 */
export type WildcardNotation = "*";
/**
 * Union of all possible string representation for populate
 *
 * @example
 * type A = 'image'; // ✅
 * type B = 'image,component'; // ✅
 * type c = '*'; // ✅
 * type D = 'populatableField'; // ✅
 * type E = '<random_string>'; // ❌
 */
export type StringNotation<TSchemaUID extends Common.UID.Schema> =
  | WildcardNotation
  | Utils.Guard.Never<Attribute.GetPopulatableKeys<TSchemaUID>, string>
  | `${string},${string}`
  | `${string}.${string}`;
/**
 * Array notation for populate
 *
 * @example
 * type A = ['image']; // ✅
 * type B = ['image', 'component']; // ✅
 * type C = ['populatableField']; // ✅
 * type D = ['<random_string>']; // ❌
 * type E = ['*']; // ❌
 */
export type ArrayNotation<TSchemaUID extends Common.UID.Schema> = Exclude<
  StringNotation<TSchemaUID>,
  WildcardNotation
>[];
type GetPopulatableKeysWithTarget<TSchemaUID extends Common.UID.Schema> =
  Extract<
    Attribute.GetPopulatableKeys<TSchemaUID>,
    Attribute.GetKeysWithTarget<TSchemaUID>
  >;
type GetPopulatableKeysWithoutTarget<TSchemaUID extends Common.UID.Schema> =
  Exclude<
    Attribute.GetPopulatableKeys<TSchemaUID>,
    GetPopulatableKeysWithTarget<TSchemaUID>
  >;
/**
 * Fragment populate notation for polymorphic attributes
 */
export type Fragment<TMaybeTargets extends Common.UID.Schema> = {
  on?: {
    [TSchemaUID in TMaybeTargets]?: boolean | NestedParams<TSchemaUID>;
  };
};
type PopulateClause<
  TSchemaUID extends Common.UID.Schema,
  TKeys extends Attribute.GetPopulatableKeys<TSchemaUID>,
> = {
  [TKey in TKeys]?:
    | boolean
    | NestedParams<Attribute.GetTarget<TSchemaUID, TKey>>;
};
/**
 * Object notation for populate
 *
 * @example
 * type A = { image: true }; // ✅
 * type B = { image: { fields: ['url', 'provider'] } }; // ✅
 * type C = { populatableField: { populate: { nestedPopulatableField: true } } }; // ✅
 * type D = { dynamic_zone: { on: { comp_A: { fields: ['name', 'price_a'] }, comp_B: { fields: ['name', 'price_b'] } } } }; // ✅
 */
export type ObjectNotation<TSchemaUID extends Common.UID.Schema> = [
  GetPopulatableKeysWithTarget<TSchemaUID>,
  GetPopulatableKeysWithoutTarget<TSchemaUID>,
] extends [
  infer TKeysWithTarget extends Attribute.GetPopulatableKeys<TSchemaUID>,
  infer TKeysWithoutTarget extends Attribute.GetPopulatableKeys<TSchemaUID>,
]
  ? Utils.Expression.If<
      Utils.Expression.And<
        Common.AreSchemaRegistriesExtended,
        Utils.Expression.DoesNotExtends<Common.UID.Schema, TSchemaUID>
      >,
      | Utils.Expression.If<
          Utils.Expression.IsNotNever<TKeysWithTarget>,
          PopulateClause<TSchemaUID, TKeysWithTarget>
        >
      | Utils.Expression.If<
          Utils.Expression.IsNotNever<TKeysWithoutTarget>,
          {
            [TKey in TKeysWithoutTarget]?:
              | boolean
              | Fragment<
                  Utils.Guard.Never<
                    Attribute.GetMorphTargets<TSchemaUID, TKey>,
                    Common.UID.Schema
                  >
                >
              | NestedParams<Common.UID.Schema>;
          }
        >,
      | {
          [TKey in string]?: boolean | NestedParams<Common.UID.Schema>;
        }
      | {
          [TKey in string]?:
            | boolean
            | Fragment<Common.UID.Schema>
            | NestedParams<Common.UID.Schema>;
        }
    >
  : never;
export type NestedParams<TSchemaUID extends Common.UID.Schema> = Params.Pick<
  TSchemaUID,
  "fields" | "filters" | "populate" | "sort" | "plugin" | "publicationState"
>;
export type Any<TSchemaUID extends Common.UID.Schema> =
  | StringNotation<TSchemaUID>
  | ArrayNotation<TSchemaUID>
  | ObjectNotation<TSchemaUID>;
export {};
