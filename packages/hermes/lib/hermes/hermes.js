import {
  __publicField
} from "../chunk-PKBMQBKP.js";
import axios from "axios";
import { parse, stringify } from "qs";
import merge from "deepmerge";
const qs = { parse, stringify };
import { getFormattedName, getTimestamp } from "../utils/helpers";
const defaultHermesOptions = {
  verboseLogging: false,
  bustDevCache: true,
  extractData: true
};
class Hermes {
  constructor(options = defaultHermesOptions) {
    __publicField(this, "baseUrl");
    __publicField(this, "baseQuery");
    __publicField(this, "baseHeaders");
    __publicField(this, "networkMethod");
    __publicField(this, "originLocation", "Anonymous");
    __publicField(this, "axiosInstance", axios.create());
    __publicField(this, "hermesOptions");
    this.hermesOptions = this.mergeHermesOptions(options);
    this.originLocation = this.hermesOptions.originLocation ?? "Anonymous";
  }
  mergeHermesOptions(options) {
    return merge(defaultHermesOptions, options);
  }
  // This coerces all responses to Golang style {data, error} responses. Anything else is just AIDS past a certain point of complexity.
  normalizeResponse(promise, extractData = this.hermesOptions.extractData ?? true) {
    return promise.then((data) => {
      if (this.verbose) this.log(data);
      return {
        data: this.normalizeDataReturn(data, extractData),
        error: void 0
      };
    }).catch((error) => {
      if (this.verbose) this.error(error);
      if (error.response) {
        return {
          data: void 0,
          error: error?.response?.data?.error || error.response.data
        };
      } else {
        return {
          data: void 0,
          error: {
            code: 0,
            message: error.message
          }
        };
      }
    });
  }
  transformVerboseLog(error) {
    return {
      message: error.message,
      code: error.code,
      response: error.response,
      request: error.request
    };
  }
  log(...args) {
    let timestamp = getTimestamp();
    let formattedName = getFormattedName(this.originLocation);
    console.log(`${timestamp} [${formattedName}] `, ...args);
  }
  error(error) {
    let timestamp = getTimestamp();
    let formattedName = getFormattedName(this.originLocation);
    console.error(`${timestamp} [${formattedName}] ERROR: `, error);
  }
  normalizeDataReturn(data, extractData = this.hermesOptions.extractData ?? true) {
    if (!extractData) {
      return data;
    }
    if (data?.data) {
      return data.data;
    }
    return data;
  }
  mergeBaseHeadersWithOptions(options) {
    return merge(options, { headers: this.baseHeaders });
  }
  mergeDefaultFetchOptions(options = {}) {
    return merge(this.defaultFetchOptions, options);
  }
  get verbose() {
    return this.hermesOptions.verboseLogging ?? false;
  }
  get qs() {
    return qs;
  }
  get defaultFetchOptions() {
    const _headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    const _next = {
      tags: ["global"]
    };
    if (this.hermesOptions.bustDevCache) {
      _next["revalidate"] = process.env.NODE_ENV === "development" ? 0 : false;
    }
    const defaultOptions = {
      headers: _headers,
      next: _next
    };
    return defaultOptions;
  }
  withBaseUrl(url) {
    if (!this.baseUrl) return url;
    let s = "";
    if (!(url.startsWith("/") || this.baseUrl.endsWith("/"))) {
      s = "/";
    }
    return `${this.baseUrl}${s}${url}`;
  }
  // Hermes Fetch abstraction
  async fetch(input, options) {
    input = this.sanitizeUrl(input);
    input = this.withBaseUrl(input);
    options = this.mergeDefaultFetchOptions(options);
    options = this.mergeBaseHeadersWithOptions(options);
    const promise = fetch(input, options).then(
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
  get axios() {
    return {
      get: async (url, options) => {
        return await this.normalizeResponse(
          this.axiosInstance.get(
            this.sanitizeUrl(url),
            this.mergeBaseHeadersWithOptions(options)
          )
        );
      },
      post: async (url, data, options) => {
        return await this.normalizeResponse(
          this.axiosInstance.post(
            this.sanitizeUrl(url),
            data,
            this.mergeBaseHeadersWithOptions(options)
          )
        );
      },
      put: async (url, data, options) => {
        return await this.normalizeResponse(
          this.axiosInstance.put(
            this.sanitizeUrl(url),
            data,
            this.mergeBaseHeadersWithOptions(options)
          )
        );
      },
      delete: async (url, options) => {
        return await this.normalizeResponse(
          this.axiosInstance.delete(
            this.sanitizeUrl(url),
            this.mergeBaseHeadersWithOptions(options)
          )
        );
      }
    };
  }
  sanitizeUrl(url) {
    if (!this.baseUrl) {
      let [protocol, rest] = url.split("://");
      url = url.replace(/\/\//g, "/");
      return `${protocol}://${rest}`;
    }
    url = url.replace(/\/\//g, "/");
    url = url.replace(/^\//, "");
    url = `/${url}`;
    return url;
  }
  sanitizeBaseUrl(url) {
    let [protocol, rest] = url.split("://");
    if (!rest) {
      throw new Error(`(HERMES) Error sanitizing - Malformed URL: ${url}`);
    }
    rest = rest.replace(/\/\//g, "/");
    rest = rest.replace(/\/$/, "");
    return `${protocol}://${rest}`;
  }
  // All of these builder methods return the Hermes instance for method chaining
  addBaseUrl(url) {
    let _url = this.sanitizeBaseUrl(url);
    this.baseUrl = _url;
    this.axiosInstance.defaults.baseURL = _url;
    return this;
  }
  addBaseQuery(query) {
    this.baseQuery = query;
    return this;
  }
  addBaseHeaders(headers) {
    this.baseHeaders = headers;
    return this;
  }
  setLabel(label) {
    this.originLocation = label;
    return this;
  }
}
var hermes_default = Hermes;
export {
  hermes_default as default
};
