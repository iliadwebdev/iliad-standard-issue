import { QueryStringCollection, CrudQuery, HttpMethod } from "./types";

import { createFinalURL, FetchOptions } from "openapi-fetch";
import { extendsType } from "@iliad.dev/ts-utils";
import qs from "qs";
import {
  createQuerySerializer,
  defaultBodySerializer,
  mergeHeaders,
} from "openapi-fetch";

export async function restOperation() {}

export async function crudOperation() {}

export function normalizeUrl(url: string | number, api: boolean = true) {
  let str = url.toString();

  if (!api || str.startsWith("/api")) return str;
  return str.startsWith("/") ? `/api${str}` : `/api/${str}`;
}

function removeTrailingSlash(url: string): string {
  if (url.endsWith("/")) {
    return url.substring(0, url.length - 1);
  }
  return url;
}

type CreateUrlParams = {
  baseLocation?: string | URL;
  endpoint?: string | URL;
  query?: CrudQuery<any>;
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

export function apiEndpoint(collection: string) {
  return `/api/${collection}`;
}

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

export function parseSemanticQuery(query: QueryStringCollection<any>): object {
  if (!extendsType<string>(query)) return query; // If it already an object, return it.

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
