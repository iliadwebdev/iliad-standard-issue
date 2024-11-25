import {
  APIResponseCollection,
  APIResponseData,
  StrapiResponse,
  // INTERNAL TYPINGS
  StandardResponse,
  ContextClient,
  ErrorResponse,
} from "@types";
import { normalizeUrl, apiEndpoint, createUrl, wm } from "./utils";
import { Hermes } from "@iliad.dev/hermes";
import { Common } from "@strapi/strapi";

import {
  QueryStringCollection,
  CollectionTypeNames,
  UIDFromPluralName,
  QueryStringEntry,
  CrudQueryFull,
  CTUID,
  // OPENAPI TYPINGS
  HttpMethod,
  FetchResponse,
} from "./types";
import { Feature, FeatureParams } from "../Feature";
import { StrapiUtils } from "@utils";
import { MediaType } from "./types";
import { PathsWithMethod } from "openapi-typescript-helpers";
import { MaybeOptionalInit } from "openapi-fetch";
import createClient from "openapi-fetch";

type MethodRequiredRequestInit = RequestInit & { method: HttpMethod };
type ISAKeys = Extract<keyof IliadStrapiAdapter.paths, string>;

class StrapiAdapter extends Feature {
  client: ContextClient = "fetch"; // I should probably change this to fetch, given that most of the time this is being use in Next.js.
  private openApiClient: ReturnType<typeof createClient>;
  hermes: Hermes;

  constructor(props: FeatureParams) {
    super(props);

    let { client, hermes } = props;

    hermes.hermesOptions.extractData = true;
    this.hermes = hermes;

    this.openApiClient = createClient<
      IliadStrapiAdapter.paths,
      "application/json"
    >({
      headers: (this.hermes.baseHeaders || {}) as any,
      baseUrl: this.hermes.baseUrl || undefined,
    });

    if (client !== "fetch") {
      console.warn(
        "Axios is currently not supported. Defaulting to fetch instead."
      );
    }
  }

  private async normalizedFetch<R>(
    url: string,
    options: MethodRequiredRequestInit,
    o: boolean = false
  ): Promise<StandardResponse<R>> {
    return this.hermes.fetch<R>(url, options);
  }

  // REST OPERATIONS
  public async GET<R>(
    url: string | ISAKeys,
    options?: any
  ): Promise<StandardResponse<R>>;
  public async GET(
    url: string | ISAKeys,
    options?: any
  ): ReturnType<typeof this.normalizedFetch>;
  public async GET(url: string | ISAKeys, options?: any) {
    return this.normalizedFetch(normalizeUrl(url), wm("get", options));
  }

  public async POST<R>(
    url: string | ISAKeys,
    options?: any
  ): Promise<StandardResponse<R>>;
  public async POST(
    url: string | ISAKeys,
    options?: any
  ): ReturnType<typeof this.normalizedFetch>;
  public async POST(url: string | ISAKeys, options?: any) {
    return this.normalizedFetch(normalizeUrl(url), wm("post", options));
  }

  public async PUT<R>(
    url: string | ISAKeys,
    options?: any
  ): Promise<StandardResponse<R>>;
  public async PUT(
    url: string | ISAKeys,
    options?: any
  ): ReturnType<typeof this.normalizedFetch>;
  public async PUT(url: string | ISAKeys, options?: any) {
    return this.normalizedFetch(normalizeUrl(url), wm("put", options));
  }

  public async DELETE<R>(
    url: string | ISAKeys,
    options?: any
  ): Promise<StandardResponse<R>>;
  public async DELETE(
    url: string | ISAKeys,
    options?: any
  ): ReturnType<typeof this.normalizedFetch>;
  public async DELETE(url: string | ISAKeys, options?: any) {
    return this.normalizedFetch(normalizeUrl(url), wm("delete", options));
  }

  // CRUD OPERATIONS
  public async findOne<
    E extends CollectionTypeNames,
    UID extends CTUID = UIDFromPluralName<E>,
  >(
    collection: E & {},
    id: number | string,
    params?: CrudQueryFull<UID>
  ): Promise<StandardResponse<APIResponseData<UID>>> {
    const endpoint = `${apiEndpoint(collection)}/${id}`;
    const url = createUrl({
      endpoint,
      query: params,
    });

    return this.GET<APIResponseData<UID>>(url);
  }

  public async find<
    E extends CollectionTypeNames,
    UID extends CTUID = UIDFromPluralName<E>,
  >(
    collection: E & {},
    params: CrudQueryFull<UID>
  ): Promise<StandardResponse<APIResponseCollection<UID>>> {
    const url = createUrl({
      endpoint: apiEndpoint(collection),
      query: params,
    });

    return this.GET<APIResponseCollection<UID>>(url);
  }

  public async create<
    E extends CollectionTypeNames,
    UID extends CTUID = UIDFromPluralName<E>,
  >(
    collection: E & {},
    data: Partial<Record<UID, any>>
  ): Promise<StandardResponse<APIResponseData<UID>>> {
    const endpoint = apiEndpoint(collection);
    const url = createUrl({
      endpoint,
    });

    const options = {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    };

    return this.POST<APIResponseData<UID>>(url, options);
  }

  public async update<
    E extends CollectionTypeNames,
    UID extends CTUID = UIDFromPluralName<E>,
  >(
    collection: E & {},
    id: number | string,
    data: Partial<Record<UID, any>>
  ): Promise<StandardResponse<APIResponseData<UID>>> {
    const endpoint = `${apiEndpoint(collection)}/${id}`;
    const url = createUrl({
      endpoint,
    });

    const options = {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    };

    return this.PUT<APIResponseData<UID>>(url, options);
  }

  public async delete<
    E extends CollectionTypeNames,
    UID extends CTUID = UIDFromPluralName<E>,
  >(
    collection: E & {},
    id: number | string
  ): Promise<StandardResponse<APIResponseData<UID>>> {
    const endpoint = `${apiEndpoint(collection)}/${id}`;
    const url = createUrl({
      endpoint,
    });

    return this.DELETE<APIResponseData<UID>>(url);
  }

  // FINISH CRUD OPERATIONS, THEN MAKE RAW REST OPERATIONS.
  // REST OPERATIONS SHOULD HAVE AUTO-COMPLETED ENDPOINTS, IF POSSIBLE.
  // I MAY NEED TO GENERATE THESE ON THE SERVER.

  // THEN ALL IS LEFT TO DO IS MAKE THOTH AND INTEGRATE, THEN CORE FOUR + 1 IS DONE.

  // SEMANTIC OPERATIONS
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
    query: QueryStringCollection<TContentTypeUID> = "",
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
    query: QueryStringEntry<TContentTypeUID> = "",
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
    query: QueryStringCollection<TContentTypeUID> = "",
    _hermes: Hermes = this.hermes
    // test?: GetContentTypeFromEntry<typeof collection>
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

    return await StrapiUtils.coerceData(data, collection as string);
  }

  // 5. Corrected getCollectionTest Function
  async getCollectionTest<
    PN extends CollectionTypeNames,
    TContentTypeUID extends Common.UID.CollectionType = UIDFromPluralName<PN>,
  >(
    collection: PN,
    page: number = 1,
    pageSize: number = 25,
    query: QueryStringCollection<TContentTypeUID> = "",
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

    return await StrapiUtils.coerceData<TContentTypeUID>(data, collection);
  }

  async getEntry<TContentTypeUID extends Common.UID.ContentType>(
    collection: string,
    id: number,
    query: QueryStringCollection<TContentTypeUID> = "",
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
    query: QueryStringCollection<TContentTypeUID> = "",
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

  protected withContentTypes(options: any): void {}
}

export default StrapiAdapter;
export { StrapiAdapter };
export * from "./types";

// private async normalizedFetch<
// R extends any,
// Path extends PathsWithMethod<
//   IliadStrapiAdapter.Paths,
//   MethodRequiredRequestInit["method"]
// >,
// Init extends MaybeOptionalInit<
//   IliadStrapiAdapter.Paths[Path],
//   MethodRequiredRequestInit["method"]
// >,
// >(
// url: Path,
// options: MethodRequiredRequestInit
// ): Promise<
// StandardResponse<
//   R extends undefined
//     ? FetchResponse<
//         IliadStrapiAdapter.Paths[Path][MethodRequiredRequestInit["method"]],
//         Init,
//         MediaType
//       >["data"]
//     : R
// >
// > {
// return this.hermes.fetch<
//   R extends undefined
//     ? FetchResponse<
//         IliadStrapiAdapter.Paths[Path][MethodRequiredRequestInit["method"]],
//         Init,
//         MediaType
//       >["data"]
//     : R
// >(url, options);
// }
