import {
  StandardResponse,
  LiteralUnion,
  StartsWith,
  NamedTuple,
  XOR,
} from "@iliad.dev/ts-utils/@types";
import { Hermes } from "@iliad.dev/hermes";
import { Schema } from "@strapi/strapi";
import { Params } from "./params";
import { MaybeOptionalInit } from "openapi-fetch";

import { FetchResponse } from "openapi-fetch";
import {
  APIResponseCollection,
  ContextClient,
  APIResponse,
  Common,
} from "@types";
import { PopulatedStrapiInstanceParams } from "../../StrapiInstance/types";
import {
  HttpMethod,
  MediaType,
  PathsWithMethod,
} from "openapi-typescript-helpers";

export type StrapiAdapterParams = {
  warnings: PopulatedStrapiInstanceParams["warnings"];
  client: ContextClient;
  hermes: Hermes;
  api: string;
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

export type ContentTypeNames = CollectionTypeNames | SingleTypeNames;
export type CollectionTypeNames = keyof PluralNameToUID;
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

// TS doesn't recognize plugin content-types as content types because they have the pluginOptions property
// Not really sure why this is the case, but this is a workaround
type PluginCt<T> = Omit<T, "pluginOptions">;

export type Names<
  Txt extends "singular" | "plural" | "both",
  Type extends "collection" | "single" | "all",
> = {
  [K in keyof Common.Schemas]: PluginCt<Common.Schemas[K]> extends (
    Type extends "all"
      ? Schema.CollectionType | Schema.SingleType
      : Type extends "collection"
        ? Schema.CollectionType
        : Schema.SingleType
  )
    ? PluginCt<Common.Schemas[K]>["info"][Txt extends "singular"
        ? "singularName"
        : Txt extends "plural"
          ? "pluralName"
          : "singularName" | "pluralName"]
    : never;
}[keyof Common.Schemas] & {};

export type UIDFromName<N extends string> = {
  [K in keyof Common.Schemas]: PluginCt<
    Common.Schemas[K]
  > extends Schema.ContentType
    ? PluginCt<Common.Schemas[K]>["info"]["singularName"] extends N
      ? K
      : PluginCt<Common.Schemas[K]>["info"]["pluralName"] extends N
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

declare namespace CRUD {
  type FN<T> = Promise<StandardResponse<T>>;
  type UpdateNames =
    | Names<"plural", "collection">
    | Names<"singular", "single">;
  type DeleteNames =
    | Names<"plural", "collection">
    | Names<"singular", "single">;

  type SingleUpdateParams<
    API extends Names<"singular", "single">,
    UID extends CTUID = UIDFromName<API>,
  > = NamedTuple<
    [
      collection: API,
      data: UpdateData<UID>["data"],
      query?: Omit<UpdateData<UID>, "data">,
      options?: RequestInit,
    ]
  >;

  type CollectionUpdateParams<
    API extends Names<"plural", "collection">,
    UID extends CTUID = UIDFromName<API>,
  > = NamedTuple<
    [
      collection: API,
      id: string | number,
      data: UpdateData<UID>["data"],
      query?: Omit<UpdateData<UID>, "data">,
      options?: RequestInit,
    ]
  >;

  // FindOneParams
  type FindOneParamsSingle<
    API extends Names<"singular", "single">,
    UID extends CTUID = UIDFromName<API>,
  > = NamedTuple<
    [
      collection: API,
      query?: CRUD.FindOneQuery<API, UID>,
      options?: RequestInit,
    ]
  >;

  type FindOneParamsCollection<
    API extends Names<"plural", "collection">,
    UID extends CTUID = UIDFromName<API>,
  > = NamedTuple<
    [
      collection: API,
      id: number | string,
      query?: CRUD.FindOneQuery<API, UID>,
      options?: RequestInit,
    ]
  >;

  // Removes the filter property from the query object when searching for a single item.
  type FindOneQuery<API, UID extends CTUID> =
    API extends Names<"singular", "single">
      ? Omit<CrudQueryFull<UID>, "filters">
      : CrudQueryFull<UID>;
}

declare namespace REST {
  type FN<
    Path extends REST.Path,
    Init extends REST.Init<Path>,
    Method extends HttpMethod = "get",
    ContentType extends MediaType = "application/json",
  > = Promise<
    StandardResponse<
      FetchResponse<
        IliadStrapiAdapter.paths[Path][Method],
        Init,
        ContentType
      >["data"]
    >
  >;

  type Path<Method extends HttpMethod = "get"> = PathsWithMethod<
    IliadStrapiAdapter.paths,
    Method
  >;

  type Init<
    Path extends REST.Path,
    Method extends HttpMethod = "get",
  > = MaybeOptionalInit<IliadStrapiAdapter.paths[Path], Method>;
}

export { CRUD, REST };

export interface StrapiError {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
    details: Record<string, unknown>;
  };
}

export type StrapiResponse<T> = XOR<
  {
    data: T;
    meta: Record<string, unknown>;
  },
  StrapiError
>;
