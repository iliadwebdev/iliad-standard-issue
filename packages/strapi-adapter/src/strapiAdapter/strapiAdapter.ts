import { runAsyncSynchronously } from "@iliad.dev/ts-utils";
import { downloadContentTypes } from "./contentTypeSync.js";
import "@iliad.dev/ts-utils/@types";

import { Hermes } from "@iliad.dev/hermes";

// TYPES
import type {
  // StrapiEntry,
  // StrapiMetaData,
  // StrapiResponseType,
  // TransformedStrapiEntry,
  StrapiData,
  StrapiDataObject,
  // StrapiResponse,
  // INTERNAL TYPINGS
  EnvVariable,
  ErrorResponse,
  HermesOptions,
  ContextClient,
  SuccessResponse,
  StandardResponse,
} from "../@types/adapter.js";

import type {
  APIResponseCollectionMetadata,
  APIResponseCollection,
  APIResponseData,
  StrapiResponse,
  APIResponse,
} from "../@types/strapi.d.ts";

import type { Common } from "@strapi/strapi";

type TypedResponse<T extends Common.UID.ContentType> = Promise<
  StandardResponse<APIResponseCollection<T>>
>;

export type ContentTypesSyncOptions = {
  outDir: string;
};

// UTILITY FUNCTIONS
import StrapiUtils from "../utils/utils.js";

// I should move this entire implementation to a StrapiContext class that extends Hermes, and then export a default instance of that class.
class StrapiContext {
  hermes: Hermes;
  client: ContextClient = "axios";
  constructor(
    contextLabel: string,
    strapiApiLocation: EnvVariable & URL,
    strapiBearerToken?: EnvVariable,
    client?: ContextClient,
    options?: HermesOptions
  ) {
    this.hermes = new Hermes(
      contextLabel,
      StrapiUtils.mergeDefaultHermesOptions(options)
    ).addBaseUrl(strapiApiLocation as string);

    if (strapiBearerToken) {
      this.hermes.addBaseHeaders({
        Authorization: `Bearer ${strapiBearerToken}`,
      });
    }

    if (client) {
      this.client = (client as ContextClient) || this.client;
    }
  }

  // CONTEXT UTILITIES
  static createStrapiContext(
    contextLabel: string,
    strapiApiLocation: EnvVariable & URL,
    strapiBearerToken?: EnvVariable,
    options?: HermesOptions
  ): StrapiContext {
    return new StrapiContext(
      contextLabel,
      strapiApiLocation,
      strapiBearerToken,
      options
    );
  }

  private async getWithClient<T extends Common.UID.ContentType>(
    url: string | URL,
    options?: any
  ): Promise<StandardResponse<StrapiResponse<T>>> {
    url = url as string;
    let response;

    if (this.client === "axios") {
      response = await this.hermes.axios.get(url, options);
      response = response.data;
    } else {
      response = await this.hermes.fetch(url, options);
    }

    return response as StandardResponse<StrapiResponse<T>>;
  }

  // GET FUNCTIONS
  async getFullCollection<TContentTypeUID extends Common.UID.ContentType>(
    collection: string,
    query: string | object = "",
    _hermes: Hermes = this.hermes
  ): Promise<StandardResponse<APIResponseCollection<TContentTypeUID>>> {
    query = StrapiUtils.sanitizeQuery(query);

    let data: APIResponseData<TContentTypeUID>[] = [];
    let meta;

    _firstPage: {
      let { data: firstPage, error } = await this.getCollection(
        collection,
        1,
        25,
        query
      );

      if (error) {
        console.error(`Error fetching collection ${collection}:`, error, {
          query,
        });
        return { data: undefined, error } as ErrorResponse;
      }

      if (!firstPage) {
        console.error(`No data returned from Strapi`);
        return {
          data: undefined,
          error: { message: "No data returned from Strapi", code: 500 },
        } as ErrorResponse;
      }

      meta = firstPage.meta;
      data = firstPage.data as APIResponseData<TContentTypeUID>[];
    }

    let indexArray = StrapiUtils.indexArrayFromMeta(meta);

    let promises = indexArray.map(async (i) => {
      let { data: page, error } = await this.getCollection(
        collection,
        i,
        25,
        query
      );

      if (error) {
        console.error(`Error fetching collection ${collection}:`, error, {
          query,
        });
        return { data: undefined, error } as ErrorResponse;
      }

      if (!page) {
        console.error(`No data returned from Strapi`);
        return {
          data: undefined,
          error: { message: "No data returned from Strapi", code: 500 },
        } as ErrorResponse;
      }

      return page.data as APIResponseData<TContentTypeUID>[];
    });

    let pages = await Promise.all(promises);

    pages.forEach((page) => {
      if (Array.isArray(page)) {
        data = data.concat(page);
      }
    });

    return await StrapiUtils.coerceData(
      {
        meta,
        data,
      } as StrapiResponse<TContentTypeUID>,
      collection
    );
  }

  async getEntryBySlug<TContentTypeUID extends Common.UID.ContentType>(
    collection: string,
    slug: string,
    query: string | object = "",
    _hermes: Hermes = this.hermes
  ): Promise<StandardResponse<APIResponseData<TContentTypeUID>>> {
    let _q = StrapiUtils.sanitizeQuery(query, false);
    let __q = `&filters[slug][$eq]=${slug}`;

    if (_q) {
      __q += `&${_q}`;
    }

    let { data, error } = await this.getCollection(collection, 1, 1, __q);

    if (error) {
      console.error(
        `Error fetching entry by slug ${collection}/${slug}:`,
        error,
        { query: __q }
      );
      return { data: undefined, error } as ErrorResponse;
    }

    return await StrapiUtils.coerceData(data, collection, slug, true);
  }

  async getCollection<TContentTypeUID extends Common.UID.CollectionType>(
    collection: string,
    page: number = 1,
    pageSize: number = 25,
    query: string | object = "",
    _hermes: Hermes = this.hermes
  ): Promise<StandardResponse<APIResponseCollection<TContentTypeUID>>> {
    let _q = StrapiUtils.sanitizeQuery(query, false);
    let __q = `?pagination[pageSize]=${pageSize}&pagination[page]=${page}`;

    if (_q) {
      __q += `&${_q}`;
    }

    let { data, error } = await this.getWithClient(`${collection}${__q}`, {
      next: { tags: [collection, "atlas::full-revalidation"] },
    });

    if (error) {
      console.error(`Error fetching collection ${collection}:`, error, {
        query: __q,
      });
      return { data: undefined, error } as ErrorResponse;
    }

    return await StrapiUtils.coerceData(data, collection);
  }

  async getEntry<TContentTypeUID extends Common.UID.ContentType>(
    collection: string,
    id: number,
    query: string | object = "",
    _hermes: Hermes = this.hermes
  ): Promise<StandardResponse<APIResponseData<TContentTypeUID>>> {
    query = StrapiUtils.sanitizeQuery(query);

    let { data, error } = await this.getWithClient(
      `${collection}/${id}${query}`,
      {
        next: { tags: [collection, "atlas::full-revalidation"] },
      }
    );

    if (error) {
      console.error(`Error fetching entry ${collection}:`, error, { query });
      return { data: undefined, error } as ErrorResponse;
    }

    return await StrapiUtils.coerceData(data, collection, id);
  }

  async getSingle<TContentTypeUID extends Common.UID.ContentType>(
    collection: string,
    query: string | object = "",
    _hermes: Hermes = this.hermes
  ): Promise<StandardResponse<APIResponseData<TContentTypeUID>>> {
    query = StrapiUtils.sanitizeQuery(query);

    let { data, error } = await this.getWithClient(`${collection}${query}`, {
      next: { tags: [collection, "atlas::full-revalidation"] },
    });

    if (error) {
      console.error(`Error fetching entry ${collection}:`, error, { query });
      return { data: undefined, error } as ErrorResponse;
    }

    return await StrapiUtils.coerceData(data, collection);
  }

  get Hermes(): Hermes {
    return this.hermes;
  }

  withContentTypes(options: ContentTypesSyncOptions): StrapiContext {
    const { data: contentTypes, error } = runAsyncSynchronously(
      downloadContentTypes,
      this.hermes,
      options
    );
    return this;
  }

  // STATIC FUNCTIONS
  public static extractStrapiData(input: StrapiData | StrapiDataObject) {
    return StrapiUtils.extractStrapiData(input);
  }
  public extractStrapiData(input: StrapiData | StrapiDataObject) {
    return StrapiUtils.extractStrapiData(input);
  }
  // extractStrapiData = StrapiUtils.extractStrapiData;
}

export default StrapiContext;
