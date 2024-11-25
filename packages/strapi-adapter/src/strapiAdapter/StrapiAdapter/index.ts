import {
  StandardResponse,
  ErrorResponse,
  NamedTuple,
  XOR,
} from "@iliad.dev/ts-utils/@types";

// Types
import { Common } from "@strapi/strapi";
import {
  APIResponseCollection,
  APIResponseData,
  StrapiResponse,
  ContextClient,
  APIResponse,
  Flavor,
} from "@types";
import {
  QueryStringCollection,
  CollectionTypeNames,
  UIDFromPluralName,
  QueryStringEntry,
  CrudQueryFull,
  CreateData,
  CTUID,
  // OPENAPI TYPINGS
  FetchResponse,
  UIDFromName,
  UpdateData,
  Names,
} from "./types";

// Utilities
import { FetchOptions, InitParam, MaybeOptionalInit } from "openapi-fetch";
import { PathsWithMethod } from "openapi-typescript-helpers";
import { mergeDefaults } from "@iliad.dev/ts-utils";
import { Hermes } from "@iliad.dev/hermes";
import {
  parseSemanticQuery,
  parseFetchOptions,
  normalizeUrl,
  apiEndpoint,
  createUrl,
  wm,
} from "./utils";

// Classes
import { Feature, FeatureParams } from "../Feature";

declare namespace CRUD {
  type FN<T> = Promise<StandardResponse<T>>;
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
}

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
  }

  private async normalizedFetch<R, URI extends string = string>(
    url: URI,
    options: FetchOptions<URI> | RequestInit,
    flavor: Flavor = "crud"
  ): Promise<StandardResponse<R>> {
    if (flavor !== "rest") {
      console.log({
        url,
        options,
      });
      return this.hermes.fetch<R>(url, options as RequestInit);
    }

    const _options = options as FetchOptions<URI>;
    const [finalUrl, requestInit] = parseFetchOptions(url, _options);

    console.log({
      requestInit,
      finalUrl,
    });
    const { data, error } = await this.hermes.fetch<R>(finalUrl, requestInit);
    if (error !== undefined) {
      return { error, data: undefined };
    }

    return { data, error: undefined };
  }

  // REST OPERATIONS
  public async GET<
    Path extends PathsWithMethod<IliadStrapiAdapter.paths, "get">,
    Init extends MaybeOptionalInit<IliadStrapiAdapter.paths[Path], "get">,
  >(
    url: Path,
    ...init: InitParam<Init>
  ): Promise<
    StandardResponse<
      FetchResponse<
        IliadStrapiAdapter.paths[Path]["get"],
        Init,
        "application/json"
      >["data"]
    >
  > {
    const _url = normalizeUrl(url);
    const params = init.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    // @ts-ignore
    return this.normalizedFetch(_url, { ...params, method: "get" }, "rest");
  }

  public async POST<
    Path extends PathsWithMethod<IliadStrapiAdapter.paths, "post">,
    Init extends MaybeOptionalInit<IliadStrapiAdapter.paths[Path], "post">,
  >(
    url: Path,
    ...init: InitParam<Init>
  ): Promise<
    StandardResponse<
      FetchResponse<
        IliadStrapiAdapter.paths[Path]["post"],
        Init,
        "application/json"
      >["data"]
    >
  > {
    const _url = normalizeUrl(url);
    const params = init.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    // @ts-ignore
    return this.normalizedFetch(_url, { ...params, method: "post" }, "rest");
  }

  public async PUT<
    Path extends PathsWithMethod<IliadStrapiAdapter.paths, "put">,
    Init extends MaybeOptionalInit<IliadStrapiAdapter.paths[Path], "put">,
  >(
    url: Path,
    ...init: InitParam<Init>
  ): Promise<
    StandardResponse<
      FetchResponse<
        IliadStrapiAdapter.paths[Path]["put"],
        Init,
        "application/json"
      >["data"]
    >
  > {
    const _url = normalizeUrl(url);
    const params = init.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    // @ts-ignore
    return this.normalizedFetch(_url, { ...params, method: "put" }, "rest");
  }

  public async DELETE<
    Path extends PathsWithMethod<IliadStrapiAdapter.paths, "delete">,
    Init extends MaybeOptionalInit<IliadStrapiAdapter.paths[Path], "delete">,
  >(
    url: Path,
    ...init: InitParam<Init>
  ): Promise<
    StandardResponse<
      FetchResponse<
        IliadStrapiAdapter.paths[Path]["delete"],
        Init,
        "application/json"
      >["data"]
    >
  > {
    const _url = normalizeUrl(url);
    const params = init.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    // @ts-ignore
    return this.normalizedFetch(_url, { ...params, method: "delete" }, "rest");
  }

  public async OPTIONS<
    Path extends PathsWithMethod<IliadStrapiAdapter.paths, "options">,
    Init extends MaybeOptionalInit<IliadStrapiAdapter.paths[Path], "options">,
  >(
    url: Path,
    ...init: InitParam<Init>
  ): Promise<
    StandardResponse<
      FetchResponse<
        IliadStrapiAdapter.paths[Path]["options"],
        Init,
        "application/json"
      >["data"]
    >
  > {
    const _url = normalizeUrl(url);
    const params = init.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    // @ts-ignore
    return this.normalizedFetch(_url, { ...params, method: "options" }, "rest");
  }

  public async HEAD<
    Path extends PathsWithMethod<IliadStrapiAdapter.paths, "head">,
    Init extends MaybeOptionalInit<IliadStrapiAdapter.paths[Path], "head">,
  >(
    url: Path,
    ...init: InitParam<Init>
  ): Promise<
    StandardResponse<
      FetchResponse<
        IliadStrapiAdapter.paths[Path]["head"],
        Init,
        "application/json"
      >["data"]
    >
  > {
    const _url = normalizeUrl(url);
    const params = init.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    // @ts-ignore
    return this.normalizedFetch(_url, { ...params, method: "head" }, "rest");
  }

  public async PATCH<
    Path extends PathsWithMethod<IliadStrapiAdapter.paths, "patch">,
    Init extends MaybeOptionalInit<IliadStrapiAdapter.paths[Path], "patch">,
  >(
    url: Path,
    ...init: InitParam<Init>
  ): Promise<
    StandardResponse<
      FetchResponse<
        IliadStrapiAdapter.paths[Path]["patch"],
        Init,
        "application/json"
      >["data"]
    >
  > {
    const _url = normalizeUrl(url);
    const params = init.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    // @ts-ignore
    return this.normalizedFetch(_url, { ...params, method: "patch" }, "rest");
  }

  public async TRACE<
    Path extends PathsWithMethod<IliadStrapiAdapter.paths, "trace">,
    Init extends MaybeOptionalInit<IliadStrapiAdapter.paths[Path], "trace">,
  >(
    url: Path,
    ...init: InitParam<Init>
  ): Promise<
    StandardResponse<
      FetchResponse<
        IliadStrapiAdapter.paths[Path]["trace"],
        Init,
        "application/json"
      >["data"]
    >
  > {
    const _url = normalizeUrl(url);
    const params = init.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    // @ts-ignore
    return this.normalizedFetch(_url, { ...params, method: "trace" }, "rest");
  }

  // CRUD OPERATIONS
  // https://docs-v4.strapi.io/dev-docs/api/rest
  // ILIAD: NOTE: This find needs to be split into findSingle and findCollection
  public async find<
    API extends Names<"plural", "all">,
    UID extends CTUID = UIDFromName<API>,
  >(
    collection: API,
    query?: CrudQueryFull<UID>,
    options?: RequestInit
  ): CRUD.FN<APIResponseCollection<UID>> {
    const url = createUrl({
      endpoint: apiEndpoint(collection),
      query,
    });

    return this.normalizedFetch<APIResponseCollection<UID>>(
      normalizeUrl(url),
      wm("get", options)
    );
  }

  // https://docs-v4.strapi.io/dev-docs/api/rest
  // ILIAD: NOTE: This find needs to be split into findSingle and findCollection
  public async findOne<
    API extends Names<"singular", "all">,
    UID extends CTUID = UIDFromName<API>,
  >(
    collection: API,
    id: number | string,
    query?: CrudQueryFull<UID>,
    options?: RequestInit
  ): CRUD.FN<APIResponse<UID>> {
    const url = createUrl({
      endpoint: `${apiEndpoint(collection)}/${id}`,
      query,
    });

    return this.normalizedFetch<APIResponse<UID>>(
      normalizeUrl(url),
      wm("get", options)
    );
  }

  public async create<
    API extends Names<"plural", "all">,
    UID extends CTUID = UIDFromName<API>,
  >(
    collection: API,
    data: CreateData<UID>["data"],
    query?: Omit<CreateData<UID>, "data">,
    options?: RequestInit
  ): Promise<StandardResponse<APIResponseData<UID>>> {
    const url = createUrl({
      endpoint: apiEndpoint(collection),
      query,
    });

    console.log({ data });

    return this.normalizedFetch<APIResponseData<UID>>(
      normalizeUrl(url),
      wm("post", {
        ...options,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      })
    );
  }

  private async updateSingle<
    API extends Names<"singular", "single">,
    UID extends CTUID = UIDFromName<API>,
  >(
    collection: API,
    data: UpdateData<UID>["data"],
    query?: Omit<UpdateData<UID>, "data">,
    options?: RequestInit
  ): Promise<StandardResponse<APIResponseData<UID>>> {
    const url = createUrl({
      endpoint: `${apiEndpoint(collection)}`,
      query,
    });

    return this.normalizedFetch<APIResponseData<UID>>(
      normalizeUrl(url),
      wm("put", {
        // Single types are updated with PUT requests.
        ...options,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      })
    );
  }

  // https://docs-v4.strapi.io/dev-docs/api/rest
  private async updateCollection<
    API extends Names<"plural", "collection">,
    UID extends CTUID = UIDFromName<API>,
  >(
    collection: API,
    id: number | string,
    data: UpdateData<UID>["data"],
    query?: Omit<UpdateData<UID>, "data">,
    options?: RequestInit
  ): Promise<StandardResponse<APIResponseData<UID>>> {
    const url = createUrl({
      endpoint: `${apiEndpoint(collection)}/${id}`,
      query,
    });

    return this.normalizedFetch<APIResponseData<UID>>(
      normalizeUrl(url),
      wm("post", {
        // Collection types are updated with POST requests.
        ...options,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      })
    );
  }

  public async update<
    API extends Names<"singular", "single"> | Names<"plural", "collection">,
    UID extends CTUID = UIDFromName<API>,
  >(
    ...args: XOR<
      CRUD.CollectionUpdateParams<API, UID>,
      CRUD.SingleUpdateParams<API, UID>
    >
  ): Promise<StandardResponse<APIResponseData<UID>>> {
    if (typeof args[1] === "object") {
      // Single-type update
      const [collection, data, query, options] =
        args as CRUD.SingleUpdateParams<API, UID>;
      return this.updateSingle(collection, data, query, options);
    } else {
      // Collection-based update
      const [collection, id, data, query, options] =
        args as CRUD.CollectionUpdateParams<API, UID>;
      return this.updateCollection(collection, id, data, query, options);
    }
  }

  public async delete<
    API extends CollectionTypeNames,
    UID extends CTUID = UIDFromPluralName<API>,
  >(
    collection: API,
    id: number | string
  ): Promise<StandardResponse<APIResponseData<UID>>> {
    const url = createUrl({
      endpoint: `${apiEndpoint(collection)}/${id}`,
    });

    return this.normalizedFetch<APIResponseData<UID>>(
      normalizeUrl(url),
      wm("delete")
    );
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
    return {
      data: undefined,
      error: {
        message: "Not implemented",
        code: 501,
      },
    };

    // query = StrapiUtils.sanitizeQuery(query);

    // let data: APIResponseData<TContentTypeUID>[] = [];
    // let meta;

    // _firstPage: {
    //   let { data: firstPage, error } = await this.getCollection(
    //     collection,
    //     1,
    //     25,
    //     query
    //   );

    //   if (error) {
    //     console.error(`Error fetching collection ${collection}:`, error, {
    //       query,
    //     });
    //     return { data: undefined, error } as ErrorResponse;
    //   }

    //   if (!firstPage) {
    //     console.error(`No data returned from Strapi`);
    //     return {
    //       data: undefined,
    //       error: { message: "No data returned from Strapi", code: 500 },
    //     } as ErrorResponse;
    //   }

    //   meta = firstPage.meta;
    //   data = firstPage.data as APIResponseData<TContentTypeUID>[];
    // }

    // let indexArray = StrapiUtils.indexArrayFromMeta(meta);

    // let promises = indexArray.map(async (i) => {
    //   let { data: page, error } = await this.getCollection(
    //     collection,
    //     i,
    //     25,
    //     query
    //   );

    //   if (error) {
    //     console.error(`Error fetching collection ${collection}:`, error, {
    //       query,
    //     });
    //     return { data: undefined, error } as ErrorResponse;
    //   }

    //   if (!page) {
    //     console.error(`No data returned from Strapi`);
    //     return {
    //       data: undefined,
    //       error: { message: "No data returned from Strapi", code: 500 },
    //     } as ErrorResponse;
    //   }

    //   return page.data as APIResponseData<TContentTypeUID>[];
    // });

    // let pages = await Promise.all(promises);

    // pages.forEach((page) => {
    //   if (Array.isArray(page)) {
    //     data = data.concat(page);
    //   }
    // });

    // return await StrapiUtils.coerceData(
    //   {
    //     meta,
    //     data,
    //   } as StrapiResponse<TContentTypeUID>,
    //   collection
    // );
  }

  async getEntryBySlug<TContentTypeUID extends Common.UID.ContentType>(
    collection: string,
    slug: string,
    query: QueryStringEntry<TContentTypeUID> = "",
    _hermes: Hermes = this.hermes
  ): Promise<StandardResponse<APIResponseData<TContentTypeUID>>> {
    return {
      data: undefined,
      error: {
        message: "Not implemented",
        code: 501,
      },
    };

    // let _q = StrapiUtils.sanitizeQuery(query, false);
    // let __q = `&filters[slug][$eq]=${slug}`;

    // if (_q) {
    //   __q += `&${_q}`;
    // }

    // let { data, error } = await this.getCollection(collection, 1, 1, __q);

    // if (error) {
    //   console.error(
    //     `Error fetching entry by slug ${collection}/${slug}:`,
    //     error,
    //     { query: __q }
    //   );
    //   return { data: undefined, error } as ErrorResponse;
    // }

    // return await StrapiUtils.coerceData(data, collection, slug, true);
  }

  async getCollection<
    PN extends CollectionTypeNames,
    TContentTypeUID extends Common.UID.CollectionType = UIDFromPluralName<PN>,
  >(
    collection: PN,
    query: QueryStringCollection<TContentTypeUID> = "",
    options: RequestInit = {}
  ): Promise<StandardResponse<APIResponseCollection<TContentTypeUID>>> {
    const parsedQuery: object = mergeDefaults(parseSemanticQuery(query), {
      pagination: { pageSize: 25, page: 1 },
    });

    const url = createUrl({
      endpoint: apiEndpoint(collection),
      query: parsedQuery,
    });

    const { data, error } = await this.normalizedFetch<
      APIResponseCollection<TContentTypeUID>
    >(normalizeUrl(url), wm("get", options));

    if (error) {
      console.error(`Error fetching collection ${collection}:`, error);
      console.debug({ error, query, options, url, parsedQuery });
      return {
        data: undefined,
        error: {
          message: "Error fetching collection",
          code: 500,
        },
      };
    }

    return {
      data: undefined,
      error: {
        message: "Not implemented",
        code: 501,
      },
    };
  }

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
    // let _q = StrapiUtils.sanitizeQuery(query, false);
    let __q = `?pagination[pageSize]=${pageSize}&pagination[page]=${page}`;

    if (__q) {
      __q += `&${__q}`;
    }

    let { data, error } = await this.getWithClient(`${collection}${__q}`, {
      next: { tags: [collection, "atlas::full-revalidation"] },
    });

    if (error) {
      console.error(`Error fetching collection ${collection}:`, error, {
        query: __q,
      });
    }
    return { data: undefined, error } as ErrorResponse;

    // return await StrapiUtils.coerceData<TContentTypeUID>(data, collection);
  }

  protected withContentTypes(options: any): void {}
}

export default StrapiAdapter;
export { StrapiAdapter };
export * from "./types";

// <TContentTypeUID extends Common.UID.CollectionType>(
//   collection: string,
//   page: number = 1,
//   pageSize: number = 25,
//   query: QueryStringCollection<TContentTypeUID> = "",
//   _hermes: Hermes = this.hermes
//   // test?: GetContentTypeFromEntry<typeof collection>
// ): Promise<StandardResponse<APIResponseCollection<TContentTypeUID>>> {
//   let _q = StrapiUtils.sanitizeQuery(query, false);
//   let __q = `?pagination[pageSize]=${pageSize}&pagination[page]=${page}`;

//   if (_q) {
//     __q += `&${_q}`;
//   }

//   let { data, error } = await this.getWithClient(`${collection}${__q}`, {
//     next: { tags: [collection, "atlas::full-revalidation"] },
//   });

//   if (error) {
//     console.error(`Error fetching collection ${collection}:`, error, {
//       query: __q,
//     });
//     return { data: undefined, error } as ErrorResponse;
//   }

//   return await StrapiUtils.coerceData(data, collection as string);
// }

// 5. Corrected getCollectionTest Function

// async getEntry<TContentTypeUID extends Common.UID.ContentType>(
//   collection: string,
//   id: number,
//   query: QueryStringCollection<TContentTypeUID> = "",
//   _hermes: Hermes = this.hermes
// ): Promise<StandardResponse<APIResponseData<TContentTypeUID>>> {
//   query = StrapiUtils.sanitizeQuery(query);

//   let { data, error } = await this.getWithClient(
//     `${collection}/${id}${query}`,
//     {
//       next: { tags: [collection, "atlas::full-revalidation"] },
//     }
//   );

//   if (error) {
//     console.error(`Error fetching entry ${collection}:`, error, { query });
//     return { data: undefined, error } as ErrorResponse;
//   }

//   return await StrapiUtils.coerceData(data, collection, id);
// }

// async getSingle<TContentTypeUID extends Common.UID.ContentType>(
//   collection: string,
//   query: QueryStringCollection<TContentTypeUID> = "",
//   _hermes: Hermes = this.hermes
// ): Promise<StandardResponse<APIResponseData<TContentTypeUID>>> {
//   query = StrapiUtils.sanitizeQuery(query);

//   let { data, error } = await this.getWithClient(`${collection}${query}`, {
//     next: { tags: [collection, "atlas::full-revalidation"] },
//   });

//   if (error) {
//     console.error(`Error fetching entry ${collection}:`, error, { query });
//     return { data: undefined, error } as ErrorResponse;
//   }

//   return await StrapiUtils.coerceData(data, collection);
// }

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
