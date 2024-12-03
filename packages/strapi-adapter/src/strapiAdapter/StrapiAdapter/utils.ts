import {
  APIResponseCollectionMetadata,
  APIResponseCollection,
  APIResponseData,
  WithoutPage,
  GetValues,
  WithPage,
  Flavor,
} from "@types";
import { QueryStringCollection, HttpMethod, CTUID, UpdateData } from "./types";
import { FetchOptions } from "openapi-fetch";

// Utils
import {
  defaultBodySerializer,
  createFinalURL,
  mergeHeaders,
} from "openapi-fetch";
import deepmerge from "deepmerge";
import qs from "qs";

export function normalizeUrl(url: string | number, api: boolean = true) {
  let str = url.toString();

  if (!api || str.startsWith("/api")) return str;
  if (str.startsWith("api/")) return `/${str}`; // idk why this is necessary
  return str.startsWith("/") ? `/api${str}` : `/api/${str}`;
}

type CreateUrlParams = {
  baseLocation?: string | URL;
  endpoint?: string | URL;
  query?: object | string; // This may need to be strongly typed.
};

export function createUrl(
  { endpoint, query }: CreateUrlParams,
  errorGenesis: string = "createUrl"
) {
  let url = "";

  // If we supply a known endpoint to append to the base location, we should use it.
  // It may be worth consolidating all of this parsing / santization logic into a
  // single function, regardless of the flavor.
  if (endpoint) url += endpoint.toString();
  if (!query) return url;

  try {
    const stringifiedQuery = qs.stringify(query);
    return `${url}?${stringifiedQuery}`;
  } catch (e) {
    console.error(`Error parsing query parameters object`, {
      errorGenesis,
      error: e,
      query,
    });

    throw e;
  }
}

// // ILIAD: NOTE: This needs to be configurable.
// export function apiEndpoint(collection: string) {
//   return `/api/${collection}`;
// }

export function wm(
  method: HttpMethod,
  option: RequestInit = {}
): RequestInit & {
  method: HttpMethod;
} {
  return { ...option, method: method || "get" };
}

export function isFetchOptions<T>(options: any): options is FetchOptions<T> {
  return (
    options &&
    (typeof options.baseUrl === "string" ||
      typeof options.querySerializer === "function" ||
      typeof options.bodySerializer === "function" ||
      typeof options.parseAs === "string" ||
      typeof options.fetch === "function")
  );
}

function getDefaultHeadersForBody(body: any): Record<string, string> {
  // with no body, we should not to set Content-Type
  // if serialized body is FormData; browser will correctly set Content-Type & boundary expression

  if (body instanceof FormData) return {};
  if (body === undefined) return {};

  return { "Content-Type": "application/json" };
}
type CreateFinalUrlOptions = {
  baseUrl: string;
  params: {
    query?: Record<string, unknown>;
    path?: Record<string, unknown>;
  };
};
function createFinalUrl(pathname: string, options: CreateFinalUrlOptions) {
  let finalUrl = `${options.baseUrl}${pathname}`;
}

export function parseFetchOptions<URI extends string>(
  url: URI,
  fetchOptions: FetchOptions<URI>
): [string, RequestInit] {
  const FAKE_BASE_URL = "https://iliad.dev";
  const {
    baseUrl: localBaseUrl, // Already in Hermes
    // fetch = baseFetch, // Irrelevant, already in Hermes
    headers, // Not already in Hermes, necessarily, but we can add this outside this function.
    params = {}, // In RequestInit? This is interesting... probably required params for the Type, will need to serialize.
    parseAs = "json", // Dunno
    querySerializer: requestQuerySerializer,
    bodySerializer = defaultBodySerializer,
    body,
    ...init
  } = fetchOptions || {};

  const serializedBody = body === undefined ? undefined : bodySerializer(body);
  const defaultHeaders = getDefaultHeadersForBody(serializedBody);

  const requestInit = {
    redirect: "follow",
    ...init,
    body: serializedBody,
    headers: mergeHeaders(
      defaultHeaders,
      headers
      // params.header
    ),
  };

  let request = new Request(
    createFinalURL(url, {
      baseUrl: FAKE_BASE_URL,
      querySerializer: (query) => {
        return qs.stringify(query);
      },
      params,
    }),
    requestInit
  );

  /** Add custom parameters to Request object */
  for (const key in init) {
    if (!(key in request)) {
      (request as any)[key] = (init as any)[key];
    }
  }

  const finalUrl = request.url.replace(FAKE_BASE_URL, "");
  const finalRequestInit: RequestInit = {
    ...request,
    headers: Object.fromEntries(request.headers.entries()),
  };

  return [finalUrl, finalRequestInit];
}

export function normalizeFetchOptions<URI extends string>(
  url: URI,
  options: FetchOptions<URI> | RequestInit
): [string, RequestInit] {
  if (!isFetchOptions<URI>(options)) return [url, options as RequestInit];
  return parseFetchOptions(url, options);
}

function ensureQuestionMark(query: string) {
  return query.startsWith("?") ? query : `?${query}`;
}

export function parseSemanticQuery(query?: QueryStringCollection<any>): object {
  if (!query) return {}; // If no query is passed, return an empty object.
  if (typeof query !== "string") return query; // If it already an object, return it.

  let parsedQuery: object;

  try {
    const sanitized = ensureQuestionMark(query);
    parsedQuery = qs.parse(sanitized);
  } catch (e) {
    console.error(
      "Error parsing query parameter string passed to @iliad.dev/strapi-adapter",
      {
        error: e,
        query,
      }
    );
    throw e;
  }

  return parsedQuery;
}

// Used to disambiguate Collection and Single Type operations
export function isSingleOverload(
  idOrData: number | string | UpdateData<CTUID>["data"]
): idOrData is object {
  return !(typeof idOrData === "number" || typeof idOrData === "string");
}

export function overrideHasId<T extends any[] = any[]>(args: any[]): args is T {
  if (typeof args[1] === "number") return true;
  if (typeof args[1] === "string") return true;
  return false;
}

export function validateApi(api: string): string {
  if (!api.startsWith("/")) return `/${api}`;
  return api;
}

export function mergeQuery<T extends QueryStringCollection<any>>(
  query: T = {} as T,
  additional: object
): T {
  const queryObject = parseSemanticQuery(query);

  return deepmerge(queryObject, additional) as T;
}

export function indexArrayFromMeta(
  meta: APIResponseCollectionMetadata
): number[] {
  return Array(meta.pagination.pageCount)
    .fill(0)
    .map((_, i) => i + 2)
    .slice(0, meta.pagination.pageCount - 1);
}

export function shouldUseFetch<T>(
  flavor: Flavor,
  options: FetchOptions<T> | RequestInit
): options is RequestInit {
  return flavor !== "rest";
}

export function sortAndRemovePagesFromEntriesArray<
  T extends WithPage<{ attributes: GetValues<any>; id: number }>,
  R extends Array<WithoutPage<T>> = Array<WithoutPage<T>>,
>(entries: Array<T>): R {
  const withoutPage = entries
    .sort((a, b) => a.page - b.page)
    .map((entry) => {
      const { page, ...rest } = entry;
      return rest;
    });
  return withoutPage as R;
}

export function addPageToEntry(
  entry: { attributes: any; id: number },
  pageNumber: number
): WithPage<typeof entry> {
  return { ...entry, page: pageNumber };
}

export function addPageToEntriesArray<
  UID extends CTUID,
  R extends Array<{ attributes: GetValues<UID>; id: number }>,
>(entries: R, pageNumber: number): Array<WithPage<R[number]>> {
  return entries.map((entry) => addPageToEntry(entry, pageNumber));
}

// Utility function to normalize REST params
export function normalizeRestParams<Init>(init: Init[]): Init {
  return init.reduce((acc, curr) => ({ ...acc, ...curr }), {} as Init);
}

type NotUndefined<T> = T extends undefined ? never : T;
type HasValidData<UID extends CTUID> = APIResponseCollection<UID> & {
  data: [NotUndefined<APIResponseData<UID>>, ...APIResponseData<UID>[]];
};

export function collectionContainsValidData<UID extends CTUID>(
  data: APIResponseCollection<UID>
): data is HasValidData<UID> {
  return data?.data?.[0]?.attributes !== undefined;
}
