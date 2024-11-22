// import "@iliad.dev/ts-utils/@types";
import { runAsyncSynchronously } from "@iliad.dev/ts-utils";
import {
  downloadContentTypes,
  requestNewContentTypes,
  downloadContentTypesSync,
  normalizeContentTypesOptions,
  doContentTypesExist,
} from "./contentTypeSync";
import type {
  ContentTypesSyncOptions,
  StrictContentTypesSyncOptions,
} from "./contentTypeSync";

import { Hermes, HermesOptions } from "@iliad.dev/hermes";

// TYPES
import type {
  APIResponseCollectionMetadata,
  APIResponseCollection,
  APIResponseData,
  StrapiResponse,
  APIResponse,
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
  ContextClient,
  SuccessResponse,
  StandardResponse,
} from "../@types";

import type { Common } from "@strapi/strapi";

type TypedResponse<T extends Common.UID.ContentType> = Promise<
  StandardResponse<APIResponseCollection<T>>
>;

// UTILITY FUNCTIONS
import StrapiUtils from "../utils/utils.js";

// I should move this entire implementation to a StrapiContext class that extends Hermes, and then export a default instance of that class.
class StrapiContext {
  private contentTypesSyncOptions: Nullable<StrictContentTypesSyncOptions> =
    null;

  client: ContextClient = "axios";
  hermes: Hermes;
  constructor(
    strapiApiLocation: EnvVariable | URL | string,
    strapiBearerToken?: EnvVariable,
    client?: ContextClient,
    options?: HermesOptions
  ) {
    this.hermes = new Hermes(
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
    strapiApiLocation: EnvVariable & URL,
    strapiBearerToken?: EnvVariable,
    options?: HermesOptions
  ): StrapiContext {
    return new StrapiContext(
      strapiApiLocation,
      strapiBearerToken,
      undefined,
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

  async requestNewContentTypes(): Promise<StandardResponse<null>> {
    return requestNewContentTypes(this.hermes);
  }

  async syncContentTypes(): Promise<StandardResponse<null>> {
    if (!this.contentTypesSyncOptions) {
      console.error("No content types sync options set.");
      return {
        data: undefined,
        error: { message: "No content types sync options set.", code: 500 },
      };
    }

    if (this.contentTypesSyncOptions.requestOnSync === true) {
      await this.requestNewContentTypes();
    }

    return downloadContentTypes(this.hermes, this.contentTypesSyncOptions)
      .then((response) => {
        return {
          data: null,
          error: undefined,
        };
      })
      .catch((error) => {
        console.error("Error syncing content types:", error);
        return {
          data: undefined,
          error,
        };
      });
  }

  get Hermes(): Hermes {
    return this.hermes;
  }

  get contentTypesExist(): boolean {
    if (!this.contentTypesSyncOptions) {
      return false;
    }
    return doContentTypesExist(this.contentTypesSyncOptions);
  }

  // STATIC FUNCTIONS
  public static extractStrapiData<T extends Common.UID.ContentType>(
    input: StrapiData<T> | StrapiDataObject<T>
  ) {
    return StrapiUtils.extractStrapiData(input);
  }

  public extractStrapiData<T extends Common.UID.ContentType>(
    input: StrapiData<T> | StrapiDataObject<T>
  ) {
    return StrapiUtils.extractStrapiData(input);
  }

  // FACTORY FUNCTIONS
  public withContentTypes(options: ContentTypesSyncOptions): StrapiContext {
    const strictOptions = this.setContentTypesSyncOptions(options);
    downloadContentTypesSync(this.hermes, strictOptions);

    return this;
  }

  public label(label: string): StrapiContext {
    this.hermes.setLabel(label);
    return this;
  }

  // Setters
  private setContentTypesSyncOptions(
    options: ContentTypesSyncOptions
  ): StrictContentTypesSyncOptions {
    this.contentTypesSyncOptions = normalizeContentTypesOptions(options);
    return this.contentTypesSyncOptions;
  }
}

export default StrapiContext;
