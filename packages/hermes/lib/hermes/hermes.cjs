"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkETV4XYOVcjs = require('../chunk-ETV4XYOV.cjs');
var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);
var _qs = require('qs');
var _deepmerge = require('deepmerge'); var _deepmerge2 = _interopRequireDefault(_deepmerge);
const qs = { parse: _qs.parse, stringify: _qs.stringify };
var _helpers = require('../utils/helpers');
const defaultHermesOptions = {
  verboseLogging: false,
  bustDevCache: true,
  extractData: true
};
class Hermes {
  constructor(options = defaultHermesOptions) {
    _chunkETV4XYOVcjs.__publicField.call(void 0, this, "baseUrl");
    _chunkETV4XYOVcjs.__publicField.call(void 0, this, "baseQuery");
    _chunkETV4XYOVcjs.__publicField.call(void 0, this, "baseHeaders");
    _chunkETV4XYOVcjs.__publicField.call(void 0, this, "networkMethod");
    _chunkETV4XYOVcjs.__publicField.call(void 0, this, "originLocation", "Anonymous");
    _chunkETV4XYOVcjs.__publicField.call(void 0, this, "axiosInstance", _axios2.default.create());
    _chunkETV4XYOVcjs.__publicField.call(void 0, this, "hermesOptions");
    this.hermesOptions = this.mergeHermesOptions(options);
    this.originLocation = _nullishCoalesce(this.hermesOptions.originLocation, () => ( "Anonymous"));
  }
  mergeHermesOptions(options) {
    return _deepmerge2.default.call(void 0, defaultHermesOptions, options);
  }
  // This coerces all responses to Golang style {data, error} responses. Anything else is just AIDS past a certain point of complexity.
  normalizeResponse(promise, extractData = _nullishCoalesce(this.hermesOptions.extractData, () => ( true))) {
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
          error: _optionalChain([error, 'optionalAccess', _ => _.response, 'optionalAccess', _2 => _2.data, 'optionalAccess', _3 => _3.error]) || error.response.data
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
    let timestamp = _helpers.getTimestamp.call(void 0, );
    let formattedName = _helpers.getFormattedName.call(void 0, this.originLocation);
    console.log(`${timestamp} [${formattedName}] `, ...args);
  }
  error(error) {
    let timestamp = _helpers.getTimestamp.call(void 0, );
    let formattedName = _helpers.getFormattedName.call(void 0, this.originLocation);
    console.error(`${timestamp} [${formattedName}] ERROR: `, error);
  }
  normalizeDataReturn(data, extractData = _nullishCoalesce(this.hermesOptions.extractData, () => ( true))) {
    if (!extractData) {
      return data;
    }
    if (_optionalChain([data, 'optionalAccess', _4 => _4.data])) {
      return data.data;
    }
    return data;
  }
  mergeBaseHeadersWithOptions(options) {
    return _deepmerge2.default.call(void 0, options, { headers: this.baseHeaders });
  }
  mergeDefaultFetchOptions(options = {}) {
    return _deepmerge2.default.call(void 0, this.defaultFetchOptions, options);
  }
  get verbose() {
    return _nullishCoalesce(this.hermesOptions.verboseLogging, () => ( false));
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


exports.default = hermes_default;
