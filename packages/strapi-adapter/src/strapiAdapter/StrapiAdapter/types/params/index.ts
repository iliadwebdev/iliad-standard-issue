import type { Common, Utils } from "@strapi/strapi";
// import type { GetPluginParams } from '..';
import type * as Sort from "./sort";
import type * as Pagination from "./pagination";
import type * as Fields from "./fields";
import type * as Filters from "./filters";
import type * as Populate from "./populate";
import type * as PublicationState from "./publication-state";
import type * as Data from "./data";
import type * as Search from "./search";
import type * as Attribute from "./attributes";

export namespace Params {
  export type Pick<
    TSchemaUID extends Common.UID.Schema,
    TKind extends Kind,
  > = Utils.Expression.MatchAllIntersect<
    [
      [
        HasMember<TKind, "sort">,
        {
          sort?: Sort.Any<TSchemaUID>;
        },
      ],
      [
        HasMember<TKind, "sort:string">,
        {
          sort?: Sort.StringNotation<TSchemaUID>;
        },
      ],
      [
        HasMember<TKind, "sort:array">,
        {
          sort?: Sort.ArrayNotation<TSchemaUID>;
        },
      ],
      [
        HasMember<TKind, "sort:object">,
        {
          sort?: Sort.ObjectNotation<TSchemaUID>;
        },
      ],
      [
        HasMember<TKind, "fields">,
        {
          fields?: Fields.Any<TSchemaUID>;
        },
      ],
      [
        HasMember<TKind, "fields:string">,
        {
          fields?: Fields.StringNotation<TSchemaUID>;
        },
      ],
      [
        HasMember<TKind, "fields:array">,
        {
          fields?: Fields.ArrayNotation<TSchemaUID>;
        },
      ],
      [
        HasMember<TKind, "filters">,
        {
          filters?: Filters.Any<TSchemaUID>;
        },
      ],
      [
        HasMember<TKind, "populate">,
        {
          populate?: Populate.Any<TSchemaUID>;
        },
      ],
      [
        HasMember<TKind, "populate:string">,
        {
          populate?: Populate.StringNotation<TSchemaUID>;
        },
      ],
      [
        HasMember<TKind, "populate:array">,
        {
          populate?: Populate.ArrayNotation<TSchemaUID>;
        },
      ],
      [
        HasMember<TKind, "populate:object">,
        {
          populate?: Populate.ObjectNotation<TSchemaUID>;
        },
      ],
      [HasMember<TKind, "pagination">, Pagination.Any],
      [HasMember<TKind, "pagination:offset">, Pagination.OffsetNotation],
      [HasMember<TKind, "pagination:page">, Pagination.PageNotation],
      [HasMember<TKind, "publicationState">, PublicationState.For<TSchemaUID>],
      // [
      //     HasMember<TKind, 'plugin'>,
      //     GetPluginParams<TSchemaUID>
      // ],
      [
        HasMember<TKind, "data">,
        {
          data?: Data.Input<TSchemaUID>;
        },
      ],
      [
        HasMember<TKind, "data:partial">,
        {
          data?: Partial<Data.Input<TSchemaUID>>;
        },
      ],
      [
        HasMember<TKind, "files">,
        {
          files?: Record<string, unknown>;
        },
      ],
      [
        HasMember<TKind, "_q">,
        {
          _q?: Search.Q;
        },
      ],
    ]
  >;
  export type Kind =
    | "sort"
    | "sort:string"
    | "sort:array"
    | "sort:object"
    | "fields"
    | "fields:string"
    | "fields:array"
    | "filters"
    | "populate"
    | "populate:string"
    | "populate:array"
    | "populate:object"
    | "pagination"
    | "pagination:offset"
    | "pagination:page"
    | "publicationState"
    | "plugin"
    | "data"
    | "data:partial"
    | "files"
    | "_q";
  type HasMember<
    TValue extends Kind,
    TTest extends Kind,
  > = Utils.Expression.Extends<TTest, TValue>;
}

export type {
  Sort,
  Pagination,
  Fields,
  Filters,
  Populate,
  PublicationState,
  Data,
  Attribute,
};
