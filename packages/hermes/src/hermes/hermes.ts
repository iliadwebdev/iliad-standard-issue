// Dependencies
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { parse, stringify } from "qs";
import merge from "deepmerge";

const qs = { parse, stringify };

// Helper functions
import { getFormattedName, getTimestamp } from "../utils/helpers";

// Types
import {
  HermesAxiosInstance,
  StandardResponse,
  HermesOptions,
  ErrorMessage,
  HermesMethod,
} from "../@types/hermes";

const defaultHermesOptions: HermesOptions = {
  verboseLogging: false,
  bustDevCache: true,
  extractData: true,
};

type NextFetchOptions = {
  revalidate?: number | boolean;
  tags: string[];
};

// TODO - FIX SANITIZATION MESS ALONGSIDE STRAPI FUNCTIONS

class Hermes {
  baseUrl?: string | null;
  baseQuery?: string | null;
  baseHeaders?: object | null;
  networkMethod?: HermesMethod | null;
  originLocation: string = "Anonymous";
  hermesOptions: HermesOptions;
  axiosInstance: AxiosInstance = axios.create();

  constructor(options: HermesOptions = defaultHermesOptions) {
    this.hermesOptions = this.mergeHermesOptions(options);
    this.originLocation = this.hermesOptions.originLocation ?? "Anonymous";
  }

  private mergeHermesOptions(options: HermesOptions): HermesOptions {
    return merge(defaultHermesOptions, options) as HermesOptions;
  }

  // This coerces all responses to Golang style {data, error} responses. Anything else is just AIDS past a certain point of complexity.
  public normalizeResponse<T>(
    promise: Promise<T>,
    extractData: boolean = this.hermesOptions.extractData ?? true
  ): Promise<StandardResponse<T>> {
    return promise
      .then((data: T) => {
        if (this.verbose) this.log(data);
        return {
          data: this.normalizeDataReturn(data, extractData),
          error: undefined,
        };
      })
      .catch((error: AxiosError) => {
        if (this.verbose) this.error(error);
        if (error.response) {
          // The client received an error ex. (5xx, 5xx)
          return {
            data: undefined,
            error:
              (error?.response?.data as any)?.error ||
              (error.response.data as ErrorMessage),
          };
        } else {
          return {
            data: undefined,
            error: {
              code: 0,
              message: error.message,
            },
          };
        }
      });
  }

  private transformVerboseLog(error: AxiosError): object {
    return {
      message: error.message,
      code: error.code,
      response: error.response,
      request: error.request,
    };
  }

  private log(...args: any[]) {
    let timestamp = getTimestamp();
    let formattedName = getFormattedName(this.originLocation);

    console.log(`${timestamp} [${formattedName}] `, ...args);
  }

  private error(error: AxiosError) {
    let timestamp = getTimestamp();
    let formattedName = getFormattedName(this.originLocation);

    console.error(`${timestamp} [${formattedName}] ERROR: `, error);
  }

  private normalizeDataReturn(
    data: any,
    extractData: boolean = this.hermesOptions.extractData ?? true
  ) {
    if (!extractData) {
      return data;
    }

    if (data?.data) {
      return data.data;
    }

    return data;
  }

  private mergeBaseHeadersWithOptions<
    T extends RequestInit | AxiosRequestConfig
  >(options: T): T {
    return merge(options, { headers: this.baseHeaders }) as T;
  }

  private mergeDefaultFetchOptions(options: RequestInit = {}): RequestInit {
    return merge(this.defaultFetchOptions, options) as RequestInit;
  }

  get verbose(): boolean {
    return this.hermesOptions.verboseLogging ?? false;
  }

  get qs(): typeof qs {
    return qs;
  }

  get defaultFetchOptions(): RequestInit {
    const _headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const _next: Partial<NextFetchOptions> = {
      tags: ["global"],
    };

    if (this.hermesOptions.bustDevCache) {
      _next["revalidate"] = process.env.NODE_ENV === "development" ? 0 : false;
    }

    const defaultOptions = {
      headers: _headers,
      next: _next,
    };

    return defaultOptions;
  }

  private withBaseUrl(url: string) {
    if (!this.baseUrl) return url;
    let s = "";

    if (!(url.startsWith("/") || this.baseUrl.endsWith("/"))) {
      s = "/";
    }

    return `${this.baseUrl}${s}${url}`;
  }

  // Hermes Fetch abstraction
  async fetch<T>(
    input: string | URL,
    options?: RequestInit
  ): Promise<StandardResponse<T>> {
    // Normalize input URL
    input = this.sanitizeUrl(input as string);
    input = this.withBaseUrl(input as string);

    // Merge default fetch options and base headers with options
    options = this.mergeDefaultFetchOptions(options);
    options = this.mergeBaseHeadersWithOptions(options);

    // Create promise to fetch data and translate into JSON
    const promise = fetch(input, options as RequestInit).then(
      async (response) => await response.json()
    );

    return this.normalizeResponse(promise);
  }

  get deployEnvironment() {
    return process.env.NODE_ENV;
  }
  get environment() {
    return typeof document === "undefined" ? "server" : "client";
  }

  // Hermes Axios abstraction
  get axios(): HermesAxiosInstance {
    return {
      get: async <T>(
        url: string,
        options?: any
      ): Promise<StandardResponse<T>> => {
        return await this.normalizeResponse(
          this.axiosInstance.get(
            this.sanitizeUrl(url),
            this.mergeBaseHeadersWithOptions(options)
          )
        );
      },
      post: async <T>(
        url: string,
        data: any,
        options?: any
      ): Promise<StandardResponse<T>> => {
        return await this.normalizeResponse(
          this.axiosInstance.post(
            this.sanitizeUrl(url),
            data,
            this.mergeBaseHeadersWithOptions(options)
          )
        );
      },
      put: async (url: string, data: any, options?: any) => {
        return await this.normalizeResponse(
          this.axiosInstance.put(
            this.sanitizeUrl(url),
            data,
            this.mergeBaseHeadersWithOptions(options)
          )
        );
      },
      delete: async (url: string, options?: any) => {
        return await this.normalizeResponse(
          this.axiosInstance.delete(
            this.sanitizeUrl(url),
            this.mergeBaseHeadersWithOptions(options)
          )
        );
      },
    } as HermesAxiosInstance;
  }

  private sanitizeUrl(url: string): string {
    if (!this.baseUrl) {
      // Split protocol from the rest of the URL as not to remove the double slashes in the protocol
      let [protocol, rest] = url.split("://");

      // Remove double slashes
      url = url.replace(/\/\//g, "/");
      return `${protocol}://${rest}`;
    }

    // Remove double slashes
    url = url.replace(/\/\//g, "/");

    // Remove leading slash
    url = url.replace(/^\//, "");

    url = `/${url}`; // This is possibly redundant, but we want to make sure the base URL + URL is always valid

    return url;
  }

  private sanitizeBaseUrl(url: string): string {
    // Split protocol from the rest of the URL as not to remove the double slashes in the protocol
    let [protocol, rest] = url.split("://");

    if (!rest) {
      // If this error throws you've likely instantiated StrapiContext in the client with inaccessible ENV variables.
      throw new Error(`(HERMES) Error sanitizing - Malformed URL: ${url}`);
    }

    // Remove double slashes
    rest = rest.replace(/\/\//g, "/");

    // Remove trailing slash
    rest = rest.replace(/\/$/, "");

    return `${protocol}://${rest}`;
  }

  // All of these builder methods return the Hermes instance for method chaining
  addBaseUrl(url: string): Hermes {
    let _url = this.sanitizeBaseUrl(url);

    this.baseUrl = _url;
    this.axiosInstance.defaults.baseURL = _url;

    return this;
  }

  addBaseQuery(query: string): Hermes {
    this.baseQuery = query;

    return this;
  }

  addBaseHeaders(headers: object): Hermes {
    this.baseHeaders = headers;

    return this;
  }

  setLabel(label: string): Hermes {
    this.originLocation = label;

    return this;
  }
}

export default Hermes;
