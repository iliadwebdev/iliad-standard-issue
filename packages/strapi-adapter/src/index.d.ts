import type { Hermes, HermesOptions } from "@iliad.dev/hermes";
import type {
  TransformedStrapiEntry,
  StrapiResponseType,
  StandardResponse,
  StrapiDataObject,
  SuccessResponse,
  StrapiResponse,
  StrapiMetaData,
  ContextClient,
  ErrorResponse,
  ErrorMessage,
  StrapiEntry,
  StrapiData,
} from "./@types/adapter";

import {
  Common,
  Attribute,
  Utils,
  APIResponseCollectionMetadata,
  APIResponseCollection,
  APIResponseData,
  APIResponse,
} from "./@types/strapi";

declare class StrapiContext {
  constructor(
    contextLabel: string,
    strapiApiLocation: string | URL,
    strapiBearerToken?: string,
    client?: ContextClient,
    options?: HermesOptions
  );

  static createStrapiContext(
    contextLabel: string,
    strapiApiLocation: string | URL,
    strapiBearerToken?: string,
    options?: HermesOptions
  ): StrapiContext;

  // Get Functions
  getFullCollection<TContentTypeUID extends Common.UID.ContentType>(
    collection: string,
    query?: string | object,
    _hermes?: Hermes
  ): Promise<StandardResponse<APIResponseCollection<TContentTypeUID>>>;

  getEntryBySlug<TContentTypeUID extends Common.UID.ContentType>(
    collection: string,
    slug: string,
    query?: string | object,
    _hermes?: Hermes
  ): Promise<StandardResponse<APIResponseData<TContentTypeUID>>>;

  getCollection<TContentTypeUID extends Common.UID.ContentType>(
    collection: string,
    page: number,
    pageSize: number,
    query?: string | object,
    _hermes?: Hermes
  ): Promise<StandardResponse<APIResponseCollection<TContentTypeUID>>>;

  getEntry<TContentTypeUID extends Common.UID.ContentType>(
    collection: string,
    id: number,
    query?: string | object,
    _hermes?: Hermes
  ): Promise<StandardResponse<APIResponseData<TContentTypeUID>>>;

  getSingle<TContentTypeUID extends Common.UID.ContentType>(
    collection: string,
    query: string | object,
    _hermes?: Hermes
  ): Promise<StandardResponse<APIResponseData<TContentTypeUID>>>;

  // Getters
  get hermes(): Hermes;

  // Static Methods
  static extractStrapiData(input: StrapiData | StrapiDataObject): object;
  extractStrapiData(input: StrapiData | StrapiDataObject): object;
}

declare namespace StrapiUtils {
  function extractStrapiData(input: StrapiData | StrapiDataObject): object;
}

export {
  APIResponseCollectionMetadata,
  APIResponseCollection,
  APIResponseData,
  APIResponse,
  Attribute,
  Common,
  Utils,
}; // Strapi types
export { StrapiUtils }; // Strapi adapter utilities

export default StrapiContext; // Strapi adapter
