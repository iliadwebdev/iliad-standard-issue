"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Hermes: () => hermes_default
});
module.exports = __toCommonJS(src_exports);

// src/hermes/hermes.ts
var import_axios = __toESM(require("axios"), 1);
var import_qs = require("qs");
var import_deepmerge = __toESM(require("deepmerge"), 1);

// src/utils/helpers.ts
function getTimestamp(showDate = false) {
  var date = /* @__PURE__ */ new Date();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  month = (month < 10 ? "0" : "") + month;
  day = (day < 10 ? "0" : "") + day;
  hour = (hour < 10 ? "0" : "") + hour;
  min = (min < 10 ? "0" : "") + min;
  sec = (sec < 10 ? "0" : "") + sec;
  var str = date.getFullYear() + "-" + month + "-" + day + "_" + hour + ":" + min + ":" + sec;
  return (showDate ? str : str?.split("_")[1]) || "00:00:00";
}
function getFormattedName(inputString, options = {}) {
  let {
    targetLength = 10,
    padWith = " ",
    padLeft = false,
    truncate = true,
    truncateWith = "..."
  } = options;
  if (inputString.length < targetLength) {
    while (inputString.length < targetLength) {
      inputString = padLeft ? padWith + inputString : inputString + padWith;
    }
  }
  if (truncate && inputString.length > targetLength) {
    inputString = inputString.slice(0, targetLength - 3) + truncateWith;
  }
  return inputString;
}

// src/hermes/hermes.ts
var qs = { parse: import_qs.parse, stringify: import_qs.stringify };
var defaultHermesOptions = {
  verboseLogging: false,
  bustDevCache: true,
  extractData: true
};
var Hermes = class {
  constructor(options = defaultHermesOptions) {
    __publicField(this, "baseUrl");
    __publicField(this, "baseQuery");
    __publicField(this, "baseHeaders");
    __publicField(this, "networkMethod");
    __publicField(this, "originLocation", "Anonymous");
    __publicField(this, "axiosInstance", import_axios.default.create());
    __publicField(this, "hermesOptions");
    this.hermesOptions = this.mergeHermesOptions(options);
    this.originLocation = this.hermesOptions.originLocation ?? "Anonymous";
  }
  mergeHermesOptions(options) {
    return (0, import_deepmerge.default)(defaultHermesOptions, options);
  }
  // This coerces all responses to Golang style {data, error} responses. Anything else is just AIDS past a certain point of complexity.
  normalizeResponse(promise, extractData = this.hermesOptions.extractData ?? true) {
    const handleError = (error) => {
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
    };
    return promise.then((data) => {
      if (this.verbose) this.log(data);
      if (typeof data === "object" && data !== null) {
        const dataKeys = Object.keys(data);
        if (dataKeys.includes("data") && dataKeys.includes("error")) {
          return handleError(data.error);
        }
      }
      return {
        data: this.normalizeDataReturn(data, extractData),
        error: void 0
      };
    }).catch((error) => {
      return handleError(error);
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
    return (0, import_deepmerge.default)(options, { headers: this.baseHeaders });
  }
  mergeDefaultFetchOptions(options = {}) {
    return (0, import_deepmerge.default)(this.defaultFetchOptions, options);
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
};
var hermes_default = Hermes;

// src/index.ts
var import_types = require("@iliad.dev/ts-utils/@types");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Hermes
});
