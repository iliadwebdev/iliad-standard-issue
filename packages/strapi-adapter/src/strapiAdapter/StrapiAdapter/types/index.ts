import { Common, ContextClient } from "../../../@types";
import { Hermes } from "@iliad.dev/hermes";
import { Params } from "./params";

export type StrapiAdapterParams = {
  client: ContextClient;
  hermes: Hermes;
};

type CTUID = Common.UID.ContentType; // Content Type UID

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
