// All types specific to the Strapi Instance will live here, for now.
import type { HermesOptions } from "@iliad.dev/hermes";
import type {
  APIResponseCollection,
  StrapiDataObject,
  APIResponseData,
  StrapiResponse,
  StrapiData,
  // INTERNAL TYPINGS
  StringLike,
  EnvVariable,
  ErrorResponse,
  ContextClient,
  StandardResponse,
} from "../../@types";

export type StrapiInstanceParams = {
  strapiApiLocation: StringLike;
  strapiBearerToken?: StringLike;
  hermesOptions?: HermesOptions;
  client?: ContextClient;
};
