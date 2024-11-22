"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }require('../chunk-PKBMQBKP.js');
var _qs = require('qs'); var _qs2 = _interopRequireDefault(_qs);
var StrapiUtils;
((StrapiUtils2) => {
  function sanitizeQuery(query = "", addQueryPrefix = true) {
    if (typeof query === "object") {
      query = _qs2.default.stringify(query);
    }
    query = query.startsWith("&") ? query.slice(1) : query;
    let qp = addQueryPrefix ? "?" : "";
    query ? query = `${qp}${query}` : query = "";
    return query.replaceAll("&?", "&");
  }
  StrapiUtils2.sanitizeQuery = sanitizeQuery;
  function mergeQueries(...queries) {
  }
  StrapiUtils2.mergeQueries = mergeQueries;
  async function coerceData(data = null, collection, id, extractSingleCollectionResponse = false, client) {
    let result;
    let apiResponse;
    let type;
    try {
      if (!data) throw new Error("No data returned from Strapi");
      apiResponse = data;
      type = "attributes" in _optionalChain([apiResponse, 'optionalAccess', _2 => _2.data]) ? "entry" : "collection";
    } catch (error) {
      console.error(
        `Error parsing entry ${collection}/${id}: ${error.message}`
      );
      return { data: void 0, error };
    }
    if (type === "entry") {
      result = apiResponse.data;
    } else {
      if (extractSingleCollectionResponse) {
        if (Array.isArray(apiResponse.data)) {
          result = apiResponse.data[0];
        } else {
          result = apiResponse.data;
        }
      } else {
        result = apiResponse;
      }
    }
    return { data: result, error: void 0 };
  }
  StrapiUtils2.coerceData = coerceData;
  function indexArrayFromMeta(meta) {
    return Array(meta.pagination.pageCount).fill(0).map((_, i) => i + 2).slice(0, meta.pagination.pageCount - 1);
  }
  StrapiUtils2.indexArrayFromMeta = indexArrayFromMeta;
  function mergeDefaultHermesOptions(options = {}) {
    return {
      verboseLogging: false,
      extractData: false,
      ...options
    };
  }
  StrapiUtils2.mergeDefaultHermesOptions = mergeDefaultHermesOptions;
  async function extractStrapiData(input) {
    function isObject(obj) {
      return obj !== null && typeof obj === "object";
    }
    function isArray(obj) {
      return Array.isArray(obj);
    }
    function isEntryObject(value) {
      return isObject(value) && "id" in value && "attributes" in value;
    }
    function isRelation(value) {
      if (!("data" in value)) return false;
      if (isArray(value.data) && value.data.every(
        (item) => isObject(item) && "id" in item && "attributes" in item
      ))
        return true;
      if (isObject(value.data) && "id" in value.data && "attributes" in value.data)
        return true;
      return false;
    }
    async function recursivelyExtractAttributes(input2) {
      switch (true) {
        case isArray(input2): {
          const a_promises = input2.map(
            async (item) => recursivelyExtractAttributes(item)
          );
          return await Promise.all(a_promises);
        }
        case isObject(input2): {
          let _input = { ...input2 };
          if (isRelation(input2)) {
            return await recursivelyExtractAttributes(input2.data);
          }
          if (isEntryObject(input2)) {
            const { id, attributes, ...rest } = input2;
            _input = {
              ...{
                id,
                ...attributes
              },
              ...rest
            };
          }
          const e_promises = Object.entries(_input).map(
            async ([key, value]) => [
              key,
              await recursivelyExtractAttributes(value)
            ]
          );
          return Object.fromEntries(await Promise.all(e_promises));
        }
        default: {
          return input2;
        }
      }
    }
    let initialInput;
    if (_optionalChain([input, 'optionalAccess', _3 => _3.data])) {
      initialInput = input.data;
    } else {
      initialInput = input;
    }
    return await recursivelyExtractAttributes(initialInput);
  }
  StrapiUtils2.extractStrapiData = extractStrapiData;
})(StrapiUtils || (StrapiUtils = {}));
var utils_default = StrapiUtils;


exports.default = utils_default;
