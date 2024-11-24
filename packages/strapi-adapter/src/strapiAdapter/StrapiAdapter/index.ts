import {
  APIResponseCollection,
  APIResponseData,
  StrapiResponse,
  // INTERNAL TYPINGS
  StandardResponse,
  ContextClient,
  ErrorResponse,
} from "@types";
import { normalizeUrl, apiEndpoint, createUrl } from "./utils";
import { Hermes } from "@iliad.dev/hermes";
import { Common } from "@strapi/strapi";

import {
  QueryStringCollection,
  CollectionTypeNames,
  UIDFromPluralName,
  QueryStringEntry,
  CrudQueryFull,
  CTUID,
} from "./types";
import { Feature, FeatureParams } from "../Feature";
import { StrapiUtils } from "@utils";

class StrapiAdapter extends Feature {
  client: ContextClient = "fetch"; // I should probably change this to fetch, given that most of the time this is being use in Next.js.
  hermes: Hermes;

  constructor(props: FeatureParams) {
    super(props);

    let { client, hermes } = props;

    hermes.hermesOptions.extractData = true;
    this.hermes = hermes;

    if (client !== "fetch") {
      console.warn(
        "Axios is currently not supported. Defaulting to fetch instead."
      );
    }
    // this.client = client;
  }

  private normalizedFetch<T>(
    method: RequestInit["method"],
    url: string | URL,
    options: RequestInit = {}
  ): Promise<StandardResponse<T>> {
    return this.hermes.fetch<T>(normalizeUrl(url), {
      ...options,
      method,
    });
  }

  // REST OPERATIONS
  public async get<R>(
    url: string | URL,
    options?: any
  ): Promise<StandardResponse<R>> {
    return this.normalizedFetch<R>("GET", url, options);
  }

  public async post<R>(
    url: string | URL,
    options?: any
  ): Promise<StandardResponse<R>> {
    return this.normalizedFetch<R>("POST", url, options);
  }

  public async put<R>(
    url: string | URL,
    options?: any
  ): Promise<StandardResponse<R>> {
    return this.normalizedFetch<R>("PUT", url, options);
  }

  private async deleteREST<R>(
    url: string | URL,
    options?: any
  ): Promise<StandardResponse<R>> {
    return this.normalizedFetch<R>("DELETE", url, options);
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

    return this.get<APIResponseData<UID>>(url);
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

    return this.get<APIResponseCollection<UID>>(url);
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

    return this.post<APIResponseData<UID>>(url, options);
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

    return this.put<APIResponseData<UID>>(url, options);
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

    return this.deleteREST<APIResponseData<UID>>(url);
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
