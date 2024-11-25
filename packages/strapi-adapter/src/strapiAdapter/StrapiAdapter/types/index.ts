import {
  APIResponse,
  APIResponseCollection,
  APIResponseData,
  Common,
  ContextClient,
} from "../../../@types";
import { Utils, Schema } from "@strapi/strapi";
import { ContentTypeInfo } from "@strapi/types/dist/types/core/schemas";
import {
  PaginatedResult,
  PartialEntity,
  Result,
  Entity,
} from "@strapi/types/dist/modules/entity-service";
import { Hermes } from "@iliad.dev/hermes";
import { Params } from "./params";

export type StrapiAdapterParams = {
  client: ContextClient;
  hermes: Hermes;
};

// Gets all the content types
export type ContentTypes = {
  [K in keyof Common.Schemas]: Common.Schemas[K] extends Schema.ContentType
    ? Common.Schemas[K]
    : never;
}[keyof Common.Schemas];

// Content type UIDs
export type ContentTypeUIDs = {
  [K in keyof Common.Schemas]: Common.Schemas[K] extends Schema.ContentType
    ? Common.Schemas[K]["uid"]
    : never;
}[keyof Common.Schemas];

export type CollectionTypeNames = keyof PluralNameToUID;
export type ContentTypeNames = CollectionTypeNames | SingleTypeNames;
export type SingleTypeNames = keyof SingleNameToUID;

export type SingleNameToUID = {
  [K in keyof Common.Schemas as Common.Schemas[K] extends Schema.SingleType
    ? Common.Schemas[K]["info"]["singularName"]
    : never]: K;
};

// Extract UID from plural name
export type PluralNameToUID = {
  [K in keyof Common.Schemas as Common.Schemas[K] extends Schema.CollectionType
    ? Common.Schemas[K]["info"]["pluralName"]
    : never]: K;
};

export type Names<
  Txt extends "singular" | "plural" | "both",
  Type extends "collection" | "single" | "all",
> = {
  [K in keyof Common.Schemas]: Common.Schemas[K] extends (
    Type extends "all"
      ? Schema.CollectionType | Schema.SingleType
      : Type extends "collection"
        ? Schema.CollectionType
        : Schema.SingleType
  )
    ? Common.Schemas[K]["info"][Txt extends "singular"
        ? "singularName"
        : Txt extends "plural"
          ? "pluralName"
          : "singularName" | "pluralName"]
    : never;
}[keyof Common.Schemas] & {};

export type UIDFromName<N extends string> = {
  [K in keyof Common.Schemas]: Common.Schemas[K] extends Schema.ContentType
    ? Common.Schemas[K]["info"]["singularName"] extends N
      ? K
      : Common.Schemas[K]["info"]["pluralName"] extends N
        ? K
        : never
    : never;
}[keyof Common.Schemas];

// Extract UID from plural name
export type UIDFromPluralName<PN extends keyof PluralNameToUID> =
  PluralNameToUID[PN];

export type UIDFromSingleName<SN extends keyof SingleNameToUID> =
  SingleNameToUID[SN];

export type UIDFromContentTypeName<E extends ContentTypeNames> =
  E extends CollectionTypeNames ? UIDFromPluralName<E> : UIDFromSingleName<E>;

// export type DefaultUIDFronContentTypeName<E extends Common.UID.ContentType> =
//   E extends CollectionTypeNames ? UIDFromPluralName<E> : UIDFromSingleName<E>;

export type CrudCollectionResponse<T extends CTUID> = StandardResponse<
  APIResponseCollection<T>
>;
export type CrudSingleResponse<T extends CTUID> = StandardResponse<
  APIResponse<T>
>;

export type CrudResponse<
  T extends CTUID,
  E extends ContentTypeNames,
> = StandardResponse<
  E extends CollectionTypeNames ? APIResponseCollection<T> : APIResponse<T>
>;

export type GetContentTypeFromEntry<T extends CTUID> = "test" | "test2";

export type CTUID = Common.UID.ContentType; // Content Type UID

export type CrudQuery<T extends CTUID> =
  | Partial<
      Params.Pick<
        T,
        | "publicationState"
        | "data:partial"
        | "pagination"
        | "populate"
        | "filters"
        | "plugin"
        | "fields"
        | "data"
        | "sort"
        | "_q"
      >
    >
  | "*";

type QueryStringAll<TContentTypeUID extends CTUID> = Params.Pick<
  TContentTypeUID,
  | "publicationState"
  | "pagination"
  | "populate"
  | "filters"
  | "plugin"
  | "fields"
  | "sort"
  | "_q"
>;

export type CreateData<UID extends CTUID> = Params.Pick<
  UID,
  "data" | "fields" | "populate"
>;

export type UpdateData<UID extends CTUID> = Params.Pick<
  UID,
  "data:partial" | "fields" | "populate"
>;
export type DeleteData<UID extends CTUID> = Params.Pick<
  UID,
  "fields" | "populate"
>;
export type CrudQueryFull<TContentTypeUID extends CTUID> =
  | Params.Pick<
      TContentTypeUID,
      | "publicationState"
      | "pagination"
      | "filters"
      | "plugin"
      | "sort"
      | "populate"
      | "fields"
    >
  | string
  | "*";

export type CrudQueryBasic<TContentTypeUID extends CTUID> = Params.Pick<
  TContentTypeUID,
  "populate" | "fields"
>;

export type QueryStringCollection<TContentTypeUID extends CTUID> =
  | Params.Pick<
      TContentTypeUID,
      "populate" | "pagination" | "sort" | "filters" | "publicationState"
    >
  | LiteralUnion<
      Extract<
        Params.Pick<
          TContentTypeUID,
          "populate" | "pagination" | "sort" | "filters" | "publicationState"
        >,
        StartsWith<string, "?">
      >
    >
  | "*";

export type QueryStringEntry<TContentTypeUID extends CTUID> =
  | Params.Pick<TContentTypeUID, "populate">
  | string
  | "*";

// ========================================
// OPENAI TYPES
// ========================================
export * from "./openapi";
