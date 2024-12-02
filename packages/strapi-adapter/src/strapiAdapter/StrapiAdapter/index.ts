import thoth from "@thoth";

// Types
import { FetchOptions, InitParam } from "openapi-fetch";
import {
  APIResponseCollectionMetadata,
  APIResponseCollection,
  APIResponseData,
  ContextClient,
  APIResponse,
  WithPage,
  Flavor,
} from "@types";
import {
  UIDFromPluralName,
  CrudQueryFull,
  UIDFromName,
  CreateData,
  UpdateData,
  Names,
  CTUID,
  CRUD,
  REST,
} from "./types";
import {
  StandardResponse,
  ErrorResponse,
  XOR,
} from "@iliad.dev/ts-utils/@types";

// Classes
import Options from "@classes/Options";
import { Feature } from "../Feature";

// Utilities
import Warnings from "@WarningsRegistry";
import * as u from "./utils";

class StrapiAdapter extends Feature {
  client: ContextClient = "fetch"; // I should probably change this to fetch, given that most of the time this is being use in Next.js.

  constructor(options: Options) {
    super(options);

    const { client } = this.options;

    // The client should not have the option to extract data.
    // Hermes API needs to be consolidated to Axios-style API, regardless of the client.
    this.hermes.hermesOptions.extractData = false;

    Warnings.warnIfNormalizeData(this.warnings, this.options);
    Warnings.warnIfAxios(this.warnings, client);
  }

  // This is the final fetch method that is used by the adapter.
  private async normalizedFetch<R, URI extends string = string>(
    url: URI,
    options: FetchOptions<URI> | RequestInit,
    flavor: Flavor = "crud"
  ): Promise<StandardResponse<R>> {
    if (u.shouldUseFetch(flavor, options)) {
      const { data, error } = await this.hermes.fetch<R>(url, options);

      if (error !== undefined) return { error, data: undefined };
      return { data, error: undefined };
    }

    const [finalUrl, requestInit] = u.parseFetchOptions(url, options);
    const { data, error } = await this.hermes.fetch<R>(finalUrl, requestInit);

    if (error !== undefined) return { error, data: undefined };
    return { data, error: undefined };
  }

  // ========================================================================
  // REST OPERATIONS - Allows arbitrary access to the Strapi API.
  // ========================================================================
  public async GET<
    Path extends REST.Path,
    Init extends REST.Init<Path> = REST.Init<Path>,
  >(url: Path, ...init: InitParam<Init>): REST.FN<Path, Init, "get"> {
    // Normalize user inputs
    const params = {
      ...u.normalizeRestParams(init),
      method: "get",
    };

    return this.normalizedFetch(u.normalizeUrl(url), params, "rest");
  }

  public async POST<
    Path extends REST.Path<"post">,
    Init extends REST.Init<Path, "post"> = REST.Init<Path, "post">,
  >(url: Path, ...init: InitParam<Init>): REST.FN<Path, Init, "post"> {
    // Normalize user inputs
    const params = {
      ...u.normalizeRestParams(init),
      method: "post",
    };

    return this.normalizedFetch(u.normalizeUrl(url), params, "rest");
  }

  public async PUT<
    Path extends REST.Path<"put">,
    Init extends REST.Init<Path, "put"> = REST.Init<Path, "put">,
  >(url: Path, ...init: InitParam<Init>): REST.FN<Path, Init, "put"> {
    // Normalize user inputs
    const params = {
      ...u.normalizeRestParams(init),
      method: "put",
    };

    return this.normalizedFetch(u.normalizeUrl(url), params, "rest");
  }

  public async DELETE<
    Path extends REST.Path<"delete">,
    Init extends REST.Init<Path, "delete"> = REST.Init<Path, "delete">,
  >(url: Path, ...init: InitParam<Init>): REST.FN<Path, Init, "delete"> {
    // Normalize user inputs
    const params = {
      ...u.normalizeRestParams(init),
      method: "delete",
    };

    return this.normalizedFetch(u.normalizeUrl(url), params, "rest");
  }

  public async OPTIONS<
    Path extends REST.Path<"options">,
    Init extends REST.Init<Path, "options"> = REST.Init<Path, "options">,
  >(url: Path, ...init: InitParam<Init>): REST.FN<Path, Init, "options"> {
    // Normalize user inputs
    const params = {
      ...u.normalizeRestParams(init),
      method: "options",
    };

    return this.normalizedFetch(u.normalizeUrl(url), params, "rest");
  }

  public async HEAD<
    Path extends REST.Path<"head">,
    Init extends REST.Init<Path, "head"> = REST.Init<Path, "head">,
  >(url: Path, ...init: InitParam<Init>): REST.FN<Path, Init, "head"> {
    // Normalize user inputs
    const params = {
      ...u.normalizeRestParams(init),
      method: "head",
    };

    return this.normalizedFetch(u.normalizeUrl(url), params, "rest");
  }

  public async PATCH<
    Path extends REST.Path<"patch">,
    Init extends REST.Init<Path, "patch"> = REST.Init<Path, "patch">,
  >(url: Path, ...init: InitParam<Init>): REST.FN<Path, Init, "patch"> {
    // Normalize user inputs
    const params = {
      ...u.normalizeRestParams(init),
      method: "patch",
    };

    return this.normalizedFetch(u.normalizeUrl(url), params, "rest");
  }

  public async TRACE<
    Path extends REST.Path<"trace">,
    Init extends REST.Init<Path, "trace"> = REST.Init<Path, "trace">,
  >(url: Path, ...init: InitParam<Init>): REST.FN<Path, Init, "trace"> {
    // Normalize user inputs
    const params = {
      ...u.normalizeRestParams(init),
      method: "trace",
    };

    return this.normalizedFetch(u.normalizeUrl(url), params, "rest");
  }
  // ========================================================================
  // CRUD OPERATIONS  -  https://docs-v4.strapi.io/dev-docs/api/rest
  // ========================================================================
  // Find entries in a collection. Not applicable to single types.
  public async find<
    API extends keyof Schema.,
    UID extends CTUID = UIDFromName<API>,
  >(
    collection: API,
    query?:
      | Params.Pick<
          UID,
          | "publicationState"
          | "pagination"
        >
      | string
      | "*",
    options?: RequestInit
  ): Promise<StandardResponse<APIResponseCollection<UID>>> {
    return await this.normalizedFetch<APIResponseCollection<UID>>(
      u.normalizeUrl(
        u.createUrl({
          endpoint: super.apiEndpoint(collection),
          query,
        })
      ),
      u.wm("get", options)
    );
  }

  // Find one entry out of a collection, or fetch a single type.
  public async findOne<
    API extends Names<"singular", "single"> | Names<"plural", "collection">,
    UID extends CTUID = UIDFromName<API>,
  >(
    ...args: XOR<
      CRUD.FindOneParamsSingle<API, UID>,
      CRUD.FindOneParamsCollection<API, UID>
    >
  ): CRUD.FN<APIResponse<UID>> {
    let options: RequestInit = {};
    let url: string;

    if (u.overrideHasId(args)) {
      const [collection, id, query, _options] =
        args as CRUD.FindOneParamsCollection<API, UID>;

      _options && (options = _options);
      url = u.createUrl({
        endpoint: `${super.apiEndpoint(collection)}/${id}`,
        query,
      });
    } else {
      const [collection, query, _options] = args as CRUD.FindOneParamsSingle<
        API,
        UID
      >;

      _options && (options = _options);
      url = u.createUrl({
        endpoint: `${super.apiEndpoint(collection)}`,
        query,
      });
    }

    return this.normalizedFetch<APIResponse<UID>>(
      u.normalizeUrl(url),
      u.wm("get", options)
    );
  }

  // Create a new entry in a collection. Not applicable to single types.
  // (?) Is there a use-case for creating a single type?
  public async create<
    API extends Names<"plural", "collection">,
    UID extends CTUID = UIDFromName<API>,
  >(
    collection: API,
    data: CreateData<UID>["data"],
    query?: Omit<CreateData<UID>, "data">,
    options?: RequestInit
  ): Promise<StandardResponse<APIResponseData<UID>>> {
    const url = u.createUrl({
      endpoint: super.apiEndpoint(collection),
      query,
    });

    return this.normalizedFetch<APIResponseData<UID>>(
      u.normalizeUrl(url),
      u.wm("post", {
        ...options,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      })
    );
  }

  public async update<
    API extends CRUD.UpdateNames,
    UID extends CTUID = UIDFromName<API>,
  >(
    ...args: XOR<
      CRUD.CollectionUpdateParams<API, UID>,
      CRUD.SingleUpdateParams<API, UID>
    >
  ): Promise<StandardResponse<APIResponseData<UID>>> {
    if (u.overrideHasId(args)) {
      // Collection-based update
      return this.updateCollection(
        ...(args as CRUD.CollectionUpdateParams<API, UID>)
      );
    }

    // Single-type update
    return this.updateSingle(...(args as CRUD.SingleUpdateParams<API, UID>));
  }

  // Create an entry in a collection. Not applicable to single types.
  // (?) Is there a use-case for deleting a single type?
  public async delete<
    API extends Names<"plural", "collection">,
    UID extends CTUID = UIDFromPluralName<API>,
  >(
    collection: API,
    id: number | string,
    options?: RequestInit
  ): Promise<StandardResponse<APIResponseData<UID>>> {
    const url = u.createUrl({
      endpoint: `${super.apiEndpoint(collection)}/${id}`,
    });

    return this.normalizedFetch<APIResponseData<UID>>(
      u.normalizeUrl(url),
      u.wm("delete", options)
    );
  }

  // Private implementation of the update method, when updating a single type.
  private async updateSingle<
    API extends Names<"singular", "single">,
    UID extends CTUID = UIDFromName<API>,
  >(
    collection: API,
    data: UpdateData<UID>["data"],
    query?: Omit<UpdateData<UID>, "data">,
    options?: RequestInit
  ): Promise<StandardResponse<APIResponseData<UID>>> {
    const url = u.createUrl({
      endpoint: `${super.apiEndpoint(collection)}`,
      query,
    });

    // Single types are updated with PUT requests.
    return this.normalizedFetch<APIResponseData<UID>>(
      u.normalizeUrl(url),
      u.wm("put", {
        ...options,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      })
    );
  }

  // Private implementation of the update method, when updating a collection.
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
    const url = u.createUrl({
      endpoint: `${super.apiEndpoint(collection)}/${id}`,
      query,
    });

    // Collection types are updated with POST requests.
    return this.normalizedFetch<APIResponseData<UID>>(
      u.normalizeUrl(url),
      u.wm("post", {
        ...options,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      })
    );
  }

  // ========================================================================
  // CRUD OPERATIONS  -  So I don't have to open the docs every four seconds.
  // ========================================================================

  async getEntry<
    API extends Names<"plural", "collection">,
    UID extends CTUID = UIDFromName<API>,
  >(
    collection: API,
    id: number | string,
    query?: CrudQueryFull<UID>,
    options?: RequestInit
  ): CRUD.FN<APIResponse<UID>> {
    const url = u.createUrl({
      endpoint: `${super.apiEndpoint(collection)}/${id}`,
      query,
    });

    return this.normalizedFetch<APIResponse<UID>>(
      u.normalizeUrl(url),
      u.wm("get", options)
    );
  }

  async getEntryBySlug<
    API extends Names<"plural", "collection">,
    UID extends CTUID = UIDFromName<API>,
  >(
    collection: API,
    slug: string,
    query?: CrudQueryFull<UID>,
    options?: RequestInit
  ): CRUD.FN<APIResponse<UID>> {
    const url = u.createUrl({
      endpoint: super.apiEndpoint(collection),
      query: u.mergeQuery(query, {
        filters: {
          slug: {
            $eq: slug,
          },
        },
      }),
    });

    const { data, error } = await this.normalizedFetch<
      APIResponseCollection<UID>
    >(u.normalizeUrl(url), u.wm("get", options));

    console.log(data, error);
    if (error !== undefined) return { data: undefined, error };

    if (!u.collectionContainsValidData<UID>(data)) {
      // Not certain this state is possible to reach.
      return {
        data: undefined,
        error: { message: "No entry found for slug", code: 404 },
      };
    }

    return {
      data: { data: data.data?.[0] },
      error: undefined,
    };
  }

  async getCollection<
    API extends Names<"plural", "collection">,
    UID extends CTUID = UIDFromName<API>,
  >(
    collection: API,
    query?: CrudQueryFull<UID>,
    options?: RequestInit
  ): CRUD.FN<APIResponseCollection<UID>> {
    const parsedQuery: object = u.mergeQuery(u.parseSemanticQuery(query), {
      pagination: { pageSize: 25, page: 1 },
    });

    const url = u.createUrl({
      endpoint: super.apiEndpoint(collection),
      query: parsedQuery,
    });

    return this.normalizedFetch<APIResponseCollection<UID>>(
      u.normalizeUrl(url),
      u.wm("get", options)
    );
  }

  async getFullCollection<
    API extends Names<"plural", "collection">,
    UID extends CTUID = UIDFromName<API>,
  >(
    collection: API,
    query?: CrudQueryFull<UID>,
    options?: RequestInit
  ): CRUD.FN<APIResponseCollection<UID>> {
    const cEntries: WithPage<APIResponseData<UID>>[] = [];
    let meta: APIResponseCollectionMetadata;

    const initialQuery = u.mergeQuery(query, {
      pagination: { pageSize: 25, page: 1 },
    });

    fetchFirstPage: {
      let { data: firstPage, error } = await this.find(
        collection,
        initialQuery,
        options
      );

      if (error || !firstPage) {
        thoth.error(`Error fetching collection ${collection}:`, error, {
          query,
        });
        return { data: undefined, error } as ErrorResponse;
      }

      const withPageNumber = u.addPageToEntriesArray(firstPage.data, 1);
      meta = firstPage.meta;

      cEntries.push(...withPageNumber);
    }

    if (Number(meta?.pagination?.pageCount) <= 1) {
      const data = { data: cEntries, meta };
      return { data, error: undefined };
    }

    // ILIAD: TODO: NOTE: This concurrent fetch is neat, but it puts the pages out of order.
    const promises = u.indexArrayFromMeta(meta).map(async (pageNumber) => {
      const { data: page, error } = await this.find(
        collection,
        u.mergeQuery(initialQuery, {
          pagination: { page: pageNumber },
        }),
        options
      );

      if (error || !page) {
        thoth.error(`Error fetching collection ${collection}:`, error);
        console.debug({ query });

        return { error };
      }

      return u.addPageToEntriesArray(page.data, pageNumber);
    });

    // Fetch all pages concurrently... unsure if this is the best way to do this.
    (await Promise.all(promises)).forEach((page) => {
      if (Array.isArray(page)) cEntries.push(...page);
    });

    const data = {
      data: u.sortAndRemovePagesFromEntriesArray(cEntries),
      meta,
    };

    return { data, error: undefined };
  }

  protected withContentTypes(options: any): void {}
}

export default StrapiAdapter;
export { StrapiAdapter };
export * from "./types";
