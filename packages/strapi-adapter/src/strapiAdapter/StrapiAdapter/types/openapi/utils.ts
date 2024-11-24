// Definitions

export type HttpMethod =
  | "get"
  | "put"
  | "post"
  | "delete"
  | "options"
  | "head"
  | "patch"
  | "trace";

export type MediaType = string;

export type RequiredKeysOf<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

export type IsOperationRequestBodyOptional<T> = T extends {
  requestBody: { required: true };
}
  ? false
  : true;

export type OperationRequestBodyContent<T> = T extends {
  requestBody: { content: infer Content };
}
  ? Content
  : never;

export type PathsWithMethod<
  Paths extends Record<string, any>,
  Method extends HttpMethod,
> = {
  [P in keyof Paths]: Method extends keyof Paths[P] ? P : never;
}[keyof Paths];

export type FilterKeys<T, K> = Pick<T, Extract<keyof T, K>>;

export type ResponseObject = {
  description?: string;
  headers?: unknown;
  content?: Record<string, unknown>;
  links?: unknown;
};

export type ResponseObjectMap<T> = T extends { responses: infer R }
  ? R extends Record<string, ResponseObject>
    ? R
    : never
  : never;

type SuccessStatusCodes =
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 208
  | 226;

export type SuccessResponse<
  T extends Record<string, ResponseObject>,
  Media extends string,
> =
  T extends Record<SuccessStatusCodes, infer R>
    ? R extends { content: Record<Media, infer C> }
      ? C
      : never
    : never;

export type ErrorResponse<
  T extends Record<string, ResponseObject>,
  Media extends string,
> =
  T extends Record<string, infer R>
    ? R extends { content: Record<Media, infer C> }
      ? C
      : never
    : never;

// Implementation

/** Options for each client instance */
export interface ClientOptions extends Omit<RequestInit, "headers"> {
  /** set the common root URL for all API requests */
  baseUrl?: string;
  /** custom fetch (defaults to globalThis.fetch) */
  fetch?: (input: Request) => Promise<Response>;
  /** custom Request (defaults to globalThis.Request) */
  Request?: typeof Request;
  /** global querySerializer */
  querySerializer?: QuerySerializer<unknown> | QuerySerializerOptions;
  /** global bodySerializer */
  bodySerializer?: BodySerializer<unknown>;
  headers?: HeadersOptions;
}

export type HeadersOptions =
  | Required<RequestInit>["headers"]
  | Record<
      string,
      | string
      | number
      | boolean
      | (string | number | boolean)[]
      | null
      | undefined
    >;

export type QuerySerializer<T> = (
  query: T extends { parameters: any }
    ? NonNullable<T["parameters"]["query"]>
    : Record<string, unknown>
) => string;

/** @see https://swagger.io/docs/specification/serialization/#query */
export type QuerySerializerOptions = {
  /** Set serialization for arrays. @see https://swagger.io/docs/specification/serialization/#query */
  array?: {
    /** default: "form" */
    style: "form" | "spaceDelimited" | "pipeDelimited";
    /** default: true */
    explode: boolean;
  };
  /** Set serialization for objects. @see https://swagger.io/docs/specification/serialization/#query */
  object?: {
    /** default: "deepObject" */
    style: "form" | "deepObject";
    /** default: true */
    explode: boolean;
  };
  /**
   * The `allowReserved` keyword specifies whether the reserved characters
   * `:/?#[]@!$&'()*+,;=` in parameter values are allowed to be sent as they
   * are, or should be percent-encoded. By default, allowReserved is `false`,
   * and reserved characters are percent-encoded.
   * @see https://swagger.io/docs/specification/serialization/#query
   */
  allowReserved?: boolean;
};

export type BodySerializer<T> = (body: OperationRequestBodyContent<T>) => any;

type BodyType<T = unknown> = {
  json: T;
  text: Awaited<ReturnType<Response["text"]>>;
  blob: Awaited<ReturnType<Response["blob"]>>;
  arrayBuffer: Awaited<ReturnType<Response["arrayBuffer"]>>;
  stream: Response["body"];
};
export type ParseAs = keyof BodyType;
export type ParseAsResponse<T, Options> = Options extends {
  parseAs: ParseAs;
}
  ? BodyType<T>[Options["parseAs"]]
  : T;

export interface DefaultParamsOption {
  params?: {
    query?: Record<string, unknown>;
  };
}

export type ParamsOption<T> = T extends {
  parameters: any;
}
  ? RequiredKeysOf<T["parameters"]> extends never
    ? { params?: T["parameters"] }
    : { params: T["parameters"] }
  : DefaultParamsOption;

export type RequestBodyOption<T> =
  OperationRequestBodyContent<T> extends never
    ? { body?: never }
    : IsOperationRequestBodyOptional<T> extends true
      ? { body?: OperationRequestBodyContent<T> }
      : { body: OperationRequestBodyContent<T> };

export type FetchOptions<T> = RequestOptions<T> &
  Omit<RequestInit, "body" | "headers">;

export type FetchResponse<
  T extends Record<string | number, any>,
  Options,
  Media extends MediaType,
> =
  | {
      data: ParseAsResponse<
        SuccessResponse<ResponseObjectMap<T>, Media>,
        Options
      >;
      error?: never;
      response: Response;
    }
  | {
      data?: never;
      error: ErrorResponse<ResponseObjectMap<T>, Media>;
      response: Response;
    };

export type RequestOptions<T> = ParamsOption<T> &
  RequestBodyOption<T> & {
    baseUrl?: string;
    querySerializer?: QuerySerializer<T> | QuerySerializerOptions;
    bodySerializer?: BodySerializer<T>;
    parseAs?: ParseAs;
    fetch?: ClientOptions["fetch"];
    headers?: HeadersOptions;
  };

export type MergedOptions<T = unknown> = {
  baseUrl: string;
  parseAs: ParseAs;
  querySerializer: QuerySerializer<T>;
  bodySerializer: BodySerializer<T>;
  fetch: typeof globalThis.fetch;
};

export interface MiddlewareCallbackParams {
  /** Current Request object */
  request: Request;
  /** The original OpenAPI schema path (including curly braces) */
  readonly schemaPath: string;
  /** OpenAPI parameters as provided from openapi-fetch */
  readonly params: {
    query?: Record<string, unknown>;
    header?: Record<string, unknown>;
    path?: Record<string, unknown>;
    cookie?: Record<string, unknown>;
  };
  /** Unique ID for this request */
  readonly id: string;
  /** createClient options (read-only) */
  readonly options: MergedOptions;
}

type MiddlewareOnRequest = (
  options: MiddlewareCallbackParams
) => void | Request | undefined | Promise<Request | undefined | void>;
type MiddlewareOnResponse = (
  options: MiddlewareCallbackParams & { response: Response }
) => void | Response | undefined | Promise<Response | undefined | void>;

export type Middleware =
  | {
      onRequest: MiddlewareOnRequest;
      onResponse?: MiddlewareOnResponse;
    }
  | {
      onRequest?: MiddlewareOnRequest;
      onResponse: MiddlewareOnResponse;
    };

/** This type helper makes the 2nd function param required if params/requestBody are required; otherwise, optional */
export type MaybeOptionalInit<Params, Location extends keyof Params> =
  RequiredKeysOf<FetchOptions<FilterKeys<Params, Location>>> extends never
    ? FetchOptions<FilterKeys<Params, Location>> | undefined
    : FetchOptions<FilterKeys<Params, Location>>;

// The final init param to accept.
// - Determines if the param is optional or not.
// - Performs arbitrary [key: string] addition.
// Note: the addition MUST happen after all the inference happens (otherwise TS can’t infer if init is required or not).
type InitParam<Init> =
  RequiredKeysOf<Init> extends never
    ? [(Init & { [key: string]: unknown })?]
    : [Init & { [key: string]: unknown }];

export type ClientMethod<
  Paths extends Record<string, Record<HttpMethod, {}>>,
  Method extends HttpMethod,
  Media extends MediaType,
> = <
  Path extends PathsWithMethod<Paths, Method>,
  Init extends MaybeOptionalInit<Paths[Path], Method>,
>(
  url: Path,
  ...init: InitParam<Init>
) => Promise<FetchResponse<Paths[Path][Method], Init, Media>>;

export type ClientForPath<
  PathInfo extends Record<string | number, any>,
  Media extends MediaType,
> = {
  [Method in keyof PathInfo as Uppercase<string & Method>]: <
    Init extends MaybeOptionalInit<PathInfo, Method>,
  >(
    ...init: InitParam<Init>
  ) => Promise<FetchResponse<PathInfo[Method], Init, Media>>;
};

export interface Client<Paths extends {}, Media extends MediaType = MediaType> {
  /** Call a GET endpoint */
  GET: ClientMethod<Paths, "get", Media>;
  /** Call a PUT endpoint */
  PUT: ClientMethod<Paths, "put", Media>;
  /** Call a POST endpoint */
  POST: ClientMethod<Paths, "post", Media>;
  /** Call a DELETE endpoint */
  DELETE: ClientMethod<Paths, "delete", Media>;
  /** Call a OPTIONS endpoint */
  OPTIONS: ClientMethod<Paths, "options", Media>;
  /** Call a HEAD endpoint */
  HEAD: ClientMethod<Paths, "head", Media>;
  /** Call a PATCH endpoint */
  PATCH: ClientMethod<Paths, "patch", Media>;
  /** Call a TRACE endpoint */
  TRACE: ClientMethod<Paths, "trace", Media>;
  /** Register middleware */
  use(...middleware: Middleware[]): void;
  /** Unregister middleware */
  eject(...middleware: Middleware[]): void;
}

export type ClientPathsWithMethod<
  CreatedClient extends Client<any, any>,
  Method extends HttpMethod,
> =
  CreatedClient extends Client<infer Paths, infer _Media>
    ? PathsWithMethod<Paths, Method>
    : never;

export type MethodResponse<
  CreatedClient extends Client<any, any>,
  Method extends HttpMethod,
  Path extends ClientPathsWithMethod<CreatedClient, Method>,
  Options = {},
> =
  CreatedClient extends Client<
    infer Paths extends { [key: string]: any },
    infer Media extends MediaType
  >
    ? NonNullable<FetchResponse<Paths[Path][Method], Options, Media>["data"]>
    : never;

export default function createClient<
  Paths extends {},
  Media extends MediaType = MediaType,
>(clientOptions?: ClientOptions): Client<Paths, Media>;

export type PathBasedClient<
  Paths extends Record<string | number, any>,
  Media extends MediaType = MediaType,
> = {
  [Path in keyof Paths]: ClientForPath<Paths[Path], Media>;
};

export declare function wrapAsPathBasedClient<
  Paths extends {},
  Media extends MediaType = MediaType,
>(client: Client<Paths, Media>): PathBasedClient<Paths, Media>;

export declare function createPathBasedClient<
  Paths extends {},
  Media extends MediaType = MediaType,
>(clientOptions?: ClientOptions): PathBasedClient<Paths, Media>;

/** Serialize primitive params to string */
export declare function serializePrimitiveParam(
  name: string,
  value: string,
  options?: { allowReserved?: boolean }
): string;

/** Serialize object param to string */
export declare function serializeObjectParam(
  name: string,
  value: Record<string, unknown>,
  options: {
    style: "simple" | "label" | "matrix" | "form" | "deepObject";
    explode: boolean;
    allowReserved?: boolean;
  }
): string;

/** Serialize array param to string */
export declare function serializeArrayParam(
  name: string,
  value: unknown[],
  options: {
    style:
      | "simple"
      | "label"
      | "matrix"
      | "form"
      | "spaceDelimited"
      | "pipeDelimited";
    explode: boolean;
    allowReserved?: boolean;
  }
): string;

/** Serialize query params to string */
export declare function createQuerySerializer<T = unknown>(
  options?: QuerySerializerOptions
): (queryParams: T) => string;

/**
 * Handle different OpenAPI 3.x serialization styles
 * @type {import("./index.js").defaultPathSerializer}
 * @see https://swagger.io/docs/specification/serialization/#path
 */
export declare function defaultPathSerializer(
  pathname: string,
  pathParams: Record<string, unknown>
): string;

/** Serialize body object to string */
export declare function defaultBodySerializer<T>(body: T): string;

/** Construct URL string from baseUrl and handle path and query params */
export declare function createFinalURL<O>(
  pathname: string,
  options: {
    baseUrl: string;
    params: {
      query?: Record<string, unknown>;
      path?: Record<string, unknown>;
    };
    querySerializer: QuerySerializer<O>;
  }
): string;

/** Merge headers a and b, with b taking priority */
export declare function mergeHeaders(
  ...allHeaders: (HeadersOptions | undefined)[]
): Headers;

/** Remove trailing slash from url */
export declare function removeTrailingSlash(url: string): string;

// settings & const
const PATH_PARAM_RE = /\{[^{}]+\}/g;

/**
 * Returns a cheap, non-cryptographically-secure random ID
 * Courtesy of @imranbarbhuiya (https://github.com/imranbarbhuiya)
 */
export function randomID() {
  return Math.random().toString(36).slice(2, 11);
}

/**
 * Create an openapi-fetch client.
 * @type {import("./index.js").default}
 */
export default function createClient(clientOptions) {
  let {
    baseUrl = "",
    Request: CustomRequest = globalThis.Request,
    fetch: baseFetch = globalThis.fetch,
    querySerializer: globalQuerySerializer,
    bodySerializer: globalBodySerializer,
    headers: baseHeaders,
    ...baseOptions
  } = { ...clientOptions };
  baseUrl = removeTrailingSlash(baseUrl);
  const middlewares = [];

  /**
   * Per-request fetch (keeps settings created in createClient()
   * @param {T} url
   * @param {import('./index.js').FetchOptions<T>} fetchOptions
   */
  async function coreFetch(schemaPath, fetchOptions) {
    const {
      baseUrl: localBaseUrl,
      fetch = baseFetch,
      Request = CustomRequest,
      headers,
      params = {},
      parseAs = "json",
      querySerializer: requestQuerySerializer,
      bodySerializer = globalBodySerializer ?? defaultBodySerializer,
      body,
      ...init
    } = fetchOptions || {};
    if (localBaseUrl) {
      baseUrl = removeTrailingSlash(localBaseUrl);
    }

    let querySerializer =
      typeof globalQuerySerializer === "function"
        ? globalQuerySerializer
        : createQuerySerializer(globalQuerySerializer);
    if (requestQuerySerializer) {
      querySerializer =
        typeof requestQuerySerializer === "function"
          ? requestQuerySerializer
          : createQuerySerializer({
              ...(typeof globalQuerySerializer === "object"
                ? globalQuerySerializer
                : {}),
              ...requestQuerySerializer,
            });
    }

    const serializedBody =
      body === undefined ? undefined : bodySerializer(body);

    const defaultHeaders =
      // with no body, we should not to set Content-Type
      serializedBody === undefined ||
      // if serialized body is FormData; browser will correctly set Content-Type & boundary expression
      serializedBody instanceof FormData
        ? {}
        : {
            "Content-Type": "application/json",
          };

    const requestInit = {
      redirect: "follow",
      ...baseOptions,
      ...init,
      body: serializedBody,
      headers: mergeHeaders(
        defaultHeaders,
        baseHeaders,
        headers,
        params.header
      ),
    };

    let id;
    let options;
    let request = new CustomRequest(
      createFinalURL(schemaPath, { baseUrl, params, querySerializer }),
      requestInit
    );

    /** Add custom parameters to Request object */
    for (const key in init) {
      if (!(key in request)) {
        request[key] = init[key];
      }
    }

    if (middlewares.length) {
      id = randomID();

      // middleware (request)
      options = Object.freeze({
        baseUrl,
        fetch,
        parseAs,
        querySerializer,
        bodySerializer,
      });
      for (const m of middlewares) {
        if (m && typeof m === "object" && typeof m.onRequest === "function") {
          const result = await m.onRequest({
            request,
            schemaPath,
            params,
            options,
            id,
          });
          if (result) {
            if (!(result instanceof CustomRequest)) {
              throw new Error(
                "onRequest: must return new Request() when modifying the request"
              );
            }
            request = result;
          }
        }
      }
    }

    // fetch!
    let response = await fetch(request);

    // middleware (response)
    // execute in reverse-array order (first priority gets last transform)
    if (middlewares.length) {
      for (let i = middlewares.length - 1; i >= 0; i--) {
        const m = middlewares[i];
        if (m && typeof m === "object" && typeof m.onResponse === "function") {
          const result = await m.onResponse({
            request,
            response,
            schemaPath,
            params,
            options,
            id,
          });
          if (result) {
            if (!(result instanceof Response)) {
              throw new Error(
                "onResponse: must return new Response() when modifying the response"
              );
            }
            response = result;
          }
        }
      }
    }

    // handle empty content
    if (
      response.status === 204 ||
      response.headers.get("Content-Length") === "0"
    ) {
      return response.ok
        ? { data: undefined, response }
        : { error: undefined, response };
    }

    // parse response (falling back to .text() when necessary)
    if (response.ok) {
      // if "stream", skip parsing entirely
      if (parseAs === "stream") {
        return { data: response.body, response };
      }
      return { data: await response[parseAs](), response };
    }

    // handle errors
    let error = await response.text();
    try {
      error = JSON.parse(error); // attempt to parse as JSON
    } catch {
      // noop
    }
    return { error, response };
  }

  return {
    /** Call a GET endpoint */
    GET(url, init) {
      return coreFetch(url, { ...init, method: "GET" });
    },
    /** Call a PUT endpoint */
    PUT(url, init) {
      return coreFetch(url, { ...init, method: "PUT" });
    },
    /** Call a POST endpoint */
    POST(url, init) {
      return coreFetch(url, { ...init, method: "POST" });
    },
    /** Call a DELETE endpoint */
    DELETE(url, init) {
      return coreFetch(url, { ...init, method: "DELETE" });
    },
    /** Call a OPTIONS endpoint */
    OPTIONS(url, init) {
      return coreFetch(url, { ...init, method: "OPTIONS" });
    },
    /** Call a HEAD endpoint */
    HEAD(url, init) {
      return coreFetch(url, { ...init, method: "HEAD" });
    },
    /** Call a PATCH endpoint */
    PATCH(url, init) {
      return coreFetch(url, { ...init, method: "PATCH" });
    },
    /** Call a TRACE endpoint */
    TRACE(url, init) {
      return coreFetch(url, { ...init, method: "TRACE" });
    },
    /** Register middleware */
    use(...middleware) {
      for (const m of middleware) {
        if (!m) {
          continue;
        }
        if (typeof m !== "object" || !("onRequest" in m || "onResponse" in m)) {
          throw new Error(
            "Middleware must be an object with one of `onRequest()` or `onResponse()`"
          );
        }
        middlewares.push(m);
      }
    },
    /** Unregister middleware */
    eject(...middleware) {
      for (const m of middleware) {
        const i = middlewares.indexOf(m);
        if (i !== -1) {
          middlewares.splice(i, 1);
        }
      }
    },
  };
}

class PathCallForwarder {
  constructor(client, url) {
    this.client = client;
    this.url = url;
  }

  GET(init) {
    return this.client.GET(this.url, init);
  }
  PUT(init) {
    return this.client.PUT(this.url, init);
  }
  POST(init) {
    return this.client.POST(this.url, init);
  }
  DELETE(init) {
    return this.client.DELETE(this.url, init);
  }
  OPTIONS(init) {
    return this.client.OPTIONS(this.url, init);
  }
  HEAD(init) {
    return this.client.HEAD(this.url, init);
  }
  PATCH(init) {
    return this.client.PATCH(this.url, init);
  }
  TRACE(init) {
    return this.client.TRACE(this.url, init);
  }
}

class PathClientProxyHandler {
  constructor() {
    this.client = null;
  }

  // Assume the property is an URL.
  get(coreClient, url) {
    const forwarder = new PathCallForwarder(coreClient, url);
    this.client[url] = forwarder;
    return forwarder;
  }
}

/**
 * Wrap openapi-fetch client to support a path based API.
 * @type {import("./index.js").wrapAsPathBasedClient}
 */
export function wrapAsPathBasedClient(coreClient) {
  const handler = new PathClientProxyHandler();
  const proxy = new Proxy(coreClient, handler);

  // Put the proxy on the prototype chain of the actual client.
  // This means if we do not have a memoized PathCallForwarder,
  // we fall back to the proxy to synthesize it.
  // However, the proxy itself is not on the hot-path (if we fetch the same
  // endpoint multiple times, only the first call will hit the proxy).
  function Client() {}
  Client.prototype = proxy;

  const client = new Client();

  // Feed the client back to the proxy handler so it can store the generated
  // PathCallForwarder.
  handler.client = client;

  return client;
}

/**
 * Convenience method to an openapi-fetch path based client.
 * Strictly equivalent to `wrapAsPathBasedClient(createClient(...))`.
 * @type {import("./index.js").createPathBasedClient}
 */
export function createPathBasedClient(clientOptions) {
  return wrapAsPathBasedClient(createClient(clientOptions));
}

// utils

/**
 * Serialize primitive param values
 * @type {import("./index.js").serializePrimitiveParam}
 */
export function serializePrimitiveParam(name, value, options) {
  if (value === undefined || value === null) {
    return "";
  }
  if (typeof value === "object") {
    throw new Error(
      "Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these."
    );
  }
  return `${name}=${options?.allowReserved === true ? value : encodeURIComponent(value)}`;
}

/**
 * Serialize object param (shallow only)
 * @type {import("./index.js").serializeObjectParam}
 */
export function serializeObjectParam(name, value, options) {
  if (!value || typeof value !== "object") {
    return "";
  }
  const values = [];
  const joiner =
    {
      simple: ",",
      label: ".",
      matrix: ";",
    }[options.style] || "&";

  // explode: false
  if (options.style !== "deepObject" && options.explode === false) {
    for (const k in value) {
      values.push(
        k,
        options.allowReserved === true ? value[k] : encodeURIComponent(value[k])
      );
    }
    const final = values.join(","); // note: values are always joined by comma in explode: false (but joiner can prefix)
    switch (options.style) {
      case "form": {
        return `${name}=${final}`;
      }
      case "label": {
        return `.${final}`;
      }
      case "matrix": {
        return `;${name}=${final}`;
      }
      default: {
        return final;
      }
    }
  }

  // explode: true
  for (const k in value) {
    const finalName = options.style === "deepObject" ? `${name}[${k}]` : k;
    values.push(serializePrimitiveParam(finalName, value[k], options));
  }
  const final = values.join(joiner);
  return options.style === "label" || options.style === "matrix"
    ? `${joiner}${final}`
    : final;
}

/**
 * Serialize array param (shallow only)
 * @type {import("./index.js").serializeArrayParam}
 */
export function serializeArrayParam(name, value, options) {
  if (!Array.isArray(value)) {
    return "";
  }

  // explode: false
  if (options.explode === false) {
    const joiner =
      { form: ",", spaceDelimited: "%20", pipeDelimited: "|" }[options.style] ||
      ","; // note: for arrays, joiners vary wildly based on style + explode behavior
    const final = (
      options.allowReserved === true
        ? value
        : value.map((v) => encodeURIComponent(v))
    ).join(joiner);
    switch (options.style) {
      case "simple": {
        return final;
      }
      case "label": {
        return `.${final}`;
      }
      case "matrix": {
        return `;${name}=${final}`;
      }
      // case "spaceDelimited":
      // case "pipeDelimited":
      default: {
        return `${name}=${final}`;
      }
    }
  }

  // explode: true
  const joiner = { simple: ",", label: ".", matrix: ";" }[options.style] || "&";
  const values = [];
  for (const v of value) {
    if (options.style === "simple" || options.style === "label") {
      values.push(options.allowReserved === true ? v : encodeURIComponent(v));
    } else {
      values.push(serializePrimitiveParam(name, v, options));
    }
  }
  return options.style === "label" || options.style === "matrix"
    ? `${joiner}${values.join(joiner)}`
    : values.join(joiner);
}

/**
 * Serialize query params to string
 * @type {import("./index.js").createQuerySerializer}
 */
export function createQuerySerializer(options) {
  return function querySerializer(queryParams) {
    const search = [];
    if (queryParams && typeof queryParams === "object") {
      for (const name in queryParams) {
        const value = queryParams[name];
        if (value === undefined || value === null) {
          continue;
        }
        if (Array.isArray(value)) {
          if (value.length === 0) {
            continue;
          }
          search.push(
            serializeArrayParam(name, value, {
              style: "form",
              explode: true,
              ...options?.array,
              allowReserved: options?.allowReserved || false,
            })
          );
          continue;
        }
        if (typeof value === "object") {
          search.push(
            serializeObjectParam(name, value, {
              style: "deepObject",
              explode: true,
              ...options?.object,
              allowReserved: options?.allowReserved || false,
            })
          );
          continue;
        }
        search.push(serializePrimitiveParam(name, value, options));
      }
    }
    return search.join("&");
  };
}

/**
 * Handle different OpenAPI 3.x serialization styles
 * @type {import("./index.js").defaultPathSerializer}
 * @see https://swagger.io/docs/specification/serialization/#path
 */
export function defaultPathSerializer(pathname, pathParams) {
  let nextURL = pathname;
  for (const match of pathname.match(PATH_PARAM_RE) ?? []) {
    let name = match.substring(1, match.length - 1);
    let explode = false;
    let style = "simple";
    if (name.endsWith("*")) {
      explode = true;
      name = name.substring(0, name.length - 1);
    }
    if (name.startsWith(".")) {
      style = "label";
      name = name.substring(1);
    } else if (name.startsWith(";")) {
      style = "matrix";
      name = name.substring(1);
    }
    if (
      !pathParams ||
      pathParams[name] === undefined ||
      pathParams[name] === null
    ) {
      continue;
    }
    const value = pathParams[name];
    if (Array.isArray(value)) {
      nextURL = nextURL.replace(
        match,
        serializeArrayParam(name, value, { style, explode })
      );
      continue;
    }
    if (typeof value === "object") {
      nextURL = nextURL.replace(
        match,
        serializeObjectParam(name, value, { style, explode })
      );
      continue;
    }
    if (style === "matrix") {
      nextURL = nextURL.replace(
        match,
        `;${serializePrimitiveParam(name, value)}`
      );
      continue;
    }
    nextURL = nextURL.replace(
      match,
      style === "label"
        ? `.${encodeURIComponent(value)}`
        : encodeURIComponent(value)
    );
  }
  return nextURL;
}

/**
 * Serialize body object to string
 * @type {import("./index.js").defaultBodySerializer}
 */
export function defaultBodySerializer(body) {
  if (body instanceof FormData) {
    return body;
  }
  return JSON.stringify(body);
}

/**
 * Construct URL string from baseUrl and handle path and query params
 * @type {import("./index.js").createFinalURL}
 */
export function createFinalURL(pathname, options) {
  let finalURL = `${options.baseUrl}${pathname}`;
  if (options.params?.path) {
    finalURL = defaultPathSerializer(finalURL, options.params.path);
  }
  let search = options.querySerializer(options.params.query ?? {});
  if (search.startsWith("?")) {
    search = search.substring(1);
  }
  if (search) {
    finalURL += `?${search}`;
  }
  return finalURL;
}

/**
 * Merge headers a and b, with b taking priority
 * @type {import("./index.js").mergeHeaders}
 */
export function mergeHeaders(...allHeaders) {
  const finalHeaders = new Headers();
  for (const h of allHeaders) {
    if (!h || typeof h !== "object") {
      continue;
    }
    const iterator = h instanceof Headers ? h.entries() : Object.entries(h);
    for (const [k, v] of iterator) {
      if (v === null) {
        finalHeaders.delete(k);
      } else if (Array.isArray(v)) {
        for (const v2 of v) {
          finalHeaders.append(k, v2);
        }
      } else if (v !== undefined) {
        finalHeaders.set(k, v);
      }
    }
  }
  return finalHeaders;
}

/**
 * Remove trailing slash from url
 * @type {import("./index.js").removeTrailingSlash}
 */
export function removeTrailingSlash(url) {
  if (url.endsWith("/")) {
    return url.substring(0, url.length - 1);
  }
  return url;
}
