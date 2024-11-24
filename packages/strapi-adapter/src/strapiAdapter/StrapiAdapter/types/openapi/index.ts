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

// export default function createClient<
//   Paths extends {},
//   Media extends MediaType = MediaType,
// >(clientOptions?: ClientOptions): Client<Paths, Media>;

// export type PathBasedClient<
//   Paths extends Record<string | number, any>,
//   Media extends MediaType = MediaType,
// > = {
//   [Path in keyof Paths]: ClientForPath<Paths[Path], Media>;
// };
