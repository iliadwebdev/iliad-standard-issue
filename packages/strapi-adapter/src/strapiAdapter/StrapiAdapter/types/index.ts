import { Common, ContextClient } from "../../../@types";
import { Utils, Schema } from "@strapi/strapi";
import { ContentTypeInfo } from "@strapi/types/dist/types/core/schemas";
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

export type SingleTypeNames = {
  [K in keyof Common.Schemas]: Common.Schemas[K] extends Schema.SingleType
    ? Common.Schemas[K]["info"]["singularName"]
    : never;
}[keyof Common.Schemas];

// Extract UID from plural name
export type PluralNameToUID = {
  [K in keyof Common.Schemas as Common.Schemas[K] extends Schema.CollectionType
    ? Common.Schemas[K]["info"]["pluralName"]
    : never]: K;
};

// Extract UID from plural name
export type UIDFromPluralName<PN extends keyof PluralNameToUID> =
  PluralNameToUID[PN];

export type GetContentTypeFromEntry<T extends CTUID> = "test" | "test2";

export type CTUID = Common.UID.ContentType; // Content Type UID

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

export type CrudQueryFind<TContentTypeUID extends CTUID> = Params.Pick<
  TContentTypeUID,
  "publicationState" | "pagination" | "filters" | "plugin" | "sort"
>;
export type CrudQueryCreate<TContentTypeUID extends CTUID> = Params.Pick<
  TContentTypeUID,
  "populate" | "fields"
>;

export type QueryStringCollection<TContentTypeUID extends CTUID> =
  | Params.Pick<
      TContentTypeUID,
      "populate" | "pagination" | "sort" | "filters" | "publicationState"
    >
  | string
  | "*";

export type QueryStringEntry<TContentTypeUID extends CTUID> =
  | Params.Pick<TContentTypeUID, "populate">
  | string
  | "*";
