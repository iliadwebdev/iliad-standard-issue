import type { Attribute, Common, Utils } from "@strapi/strapi";
import type * as AttributeUtils from "../attributes";
import type * as Operator from "./operators";
import type * as Params from "..";
export { Operator };
type IDKey = "id";
/**
 * Filter representation for nested attributes
 */
type NestedAttributeCondition<
  TSchemaUID extends Common.UID.Schema,
  TAttributeName extends Attribute.GetKeys<TSchemaUID>,
> = ObjectNotation<
  Utils.Guard.Never<
    Attribute.GetTarget<TSchemaUID, TAttributeName>,
    Common.UID.Schema
  >
>;
/**
 * Filter representation for scalar attributes
 */
type AttributeCondition<
  TSchemaUID extends Common.UID.Schema,
  TAttributeName extends IDKey | Attribute.GetKeys<TSchemaUID>,
> =
  Utils.Expression.MatchFirst<
    [
      [
        Utils.Expression.StrictEqual<TAttributeName, IDKey>,
        Params.Attribute.ID,
      ],
      [
        Utils.Expression.IsNotNever<TAttributeName>,
        AttributeUtils.GetValue<
          Attribute.Get<TSchemaUID, Exclude<TAttributeName, IDKey>>
        >,
      ],
    ],
    AttributeUtils.ScalarValues
  > extends infer TAttributeValue
    ?
        | TAttributeValue
        | ({
            [TIter in Operator.BooleanValue]?: boolean;
          } & {
            [TIter in Operator.DynamicValue]?: TAttributeValue;
          } & {
            [TIter in Operator.DynamicArrayValue]?: TAttributeValue[];
          } & {
            [TIter in Operator.DynamicBoundValue]?: [
              TAttributeValue,
              TAttributeValue,
            ];
          } & {
            [TIter in Operator.Logical]?: AttributeCondition<
              TSchemaUID,
              TAttributeName
            >;
          } & {
            [TIter in Operator.Group]?: AttributeCondition<
              TSchemaUID,
              TAttributeName
            >[];
          })
    : never;
/**
 * Tree representation of a Strapi filter for a given schema UID
 */
export type ObjectNotation<TSchemaUID extends Common.UID.Schema> = {
  [TIter in Operator.Group]?: ObjectNotation<TSchemaUID>[];
} & {
  [TIter in Operator.Logical]?: ObjectNotation<TSchemaUID>;
} & ([
    AttributeUtils.GetScalarKeys<TSchemaUID>,
    AttributeUtils.GetNestedKeys<TSchemaUID>,
  ] extends [
    infer TScalarKeys extends AttributeUtils.GetScalarKeys<TSchemaUID>,
    infer TNestedKeys extends AttributeUtils.GetNestedKeys<TSchemaUID>,
  ]
    ? Utils.Expression.If<
        Utils.Expression.And<
          Utils.Expression.IsNotNever<TScalarKeys>,
          Utils.Expression.IsNotNever<TNestedKeys>
        >,
        {
          [TIter in IDKey | TScalarKeys]?: AttributeCondition<
            TSchemaUID,
            TIter
          >;
        } & {
          [TIter in TNestedKeys]?: NestedAttributeCondition<TSchemaUID, TIter>;
        },
        {
          [TKey in string]?:
            | AttributeCondition<TSchemaUID, never>
            | NestedAttributeCondition<TSchemaUID, never>;
        }
      >
    : never);
export type Any<TSchemaUID extends Common.UID.Schema> =
  ObjectNotation<TSchemaUID>;
