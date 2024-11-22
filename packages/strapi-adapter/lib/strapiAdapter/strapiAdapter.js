"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _chunkPKBMQBKPjs = require('../chunk-PKBMQBKP.js');
var _tsutils = require('@iliad.dev/ts-utils');
var _contentTypeSyncjs = require('./contentTypeSync.js');
require('@iliad.dev/ts-utils/@types');
var _hermes2 = require('@iliad.dev/hermes');
var _utilsjs = require('../utils/utils.js'); var _utilsjs2 = _interopRequireDefault(_utilsjs);
class StrapiContext {
  constructor(contextLabel, strapiApiLocation, strapiBearerToken, client, options) {
    _chunkPKBMQBKPjs.__publicField.call(void 0, this, "hermes");
    _chunkPKBMQBKPjs.__publicField.call(void 0, this, "client", "axios");
    this.hermes = new (0, _hermes2.Hermes)(
      contextLabel,
      _utilsjs2.default.mergeDefaultHermesOptions(options)
    ).addBaseUrl(strapiApiLocation);
    if (strapiBearerToken) {
      this.hermes.addBaseHeaders({
        Authorization: `Bearer ${strapiBearerToken}`
      });
    }
    if (client) {
      this.client = client || this.client;
    }
  }
  // CONTEXT UTILITIES
  static createStrapiContext(contextLabel, strapiApiLocation, strapiBearerToken, options) {
    return new StrapiContext(
      contextLabel,
      strapiApiLocation,
      strapiBearerToken,
      options
    );
  }
  async getWithClient(url, options) {
    url = url;
    let response;
    if (this.client === "axios") {
      response = await this.hermes.axios.get(url, options);
      response = response.data;
    } else {
      response = await this.hermes.fetch(url, options);
    }
    return response;
  }
  // GET FUNCTIONS
  async getFullCollection(collection, query = "", _hermes = this.hermes) {
    query = _utilsjs2.default.sanitizeQuery(query);
    let data = [];
    let meta;
    _firstPage: {
      let { data: firstPage, error } = await this.getCollection(
        collection,
        1,
        25,
        query
      );
      if (error) {
        console.error(`Error fetching collection ${collection}:`, error, {
          query
        });
        return { data: void 0, error };
      }
      if (!firstPage) {
        console.error(`No data returned from Strapi`);
        return {
          data: void 0,
          error: { message: "No data returned from Strapi", code: 500 }
        };
      }
      meta = firstPage.meta;
      data = firstPage.data;
    }
    let indexArray = _utilsjs2.default.indexArrayFromMeta(meta);
    let promises = indexArray.map(async (i) => {
      let { data: page, error } = await this.getCollection(
        collection,
        i,
        25,
        query
      );
      if (error) {
        console.error(`Error fetching collection ${collection}:`, error, {
          query
        });
        return { data: void 0, error };
      }
      if (!page) {
        console.error(`No data returned from Strapi`);
        return {
          data: void 0,
          error: { message: "No data returned from Strapi", code: 500 }
        };
      }
      return page.data;
    });
    let pages = await Promise.all(promises);
    pages.forEach((page) => {
      if (Array.isArray(page)) {
        data = data.concat(page);
      }
    });
    return await _utilsjs2.default.coerceData(
      {
        meta,
        data
      },
      collection
    );
  }
  async getEntryBySlug(collection, slug, query = "", _hermes = this.hermes) {
    let _q = _utilsjs2.default.sanitizeQuery(query, false);
    let __q = `&filters[slug][$eq]=${slug}`;
    if (_q) {
      __q += `&${_q}`;
    }
    let { data, error } = await this.getCollection(collection, 1, 1, __q);
    if (error) {
      console.error(
        `Error fetching entry by slug ${collection}/${slug}:`,
        error,
        { query: __q }
      );
      return { data: void 0, error };
    }
    return await _utilsjs2.default.coerceData(data, collection, slug, true);
  }
  async getCollection(collection, page = 1, pageSize = 25, query = "", _hermes = this.hermes) {
    let _q = _utilsjs2.default.sanitizeQuery(query, false);
    let __q = `?pagination[pageSize]=${pageSize}&pagination[page]=${page}`;
    if (_q) {
      __q += `&${_q}`;
    }
    let { data, error } = await this.getWithClient(`${collection}${__q}`, {
      next: { tags: [collection, "atlas::full-revalidation"] }
    });
    if (error) {
      console.error(`Error fetching collection ${collection}:`, error, {
        query: __q
      });
      return { data: void 0, error };
    }
    return await _utilsjs2.default.coerceData(data, collection);
  }
  async getEntry(collection, id, query = "", _hermes = this.hermes) {
    query = _utilsjs2.default.sanitizeQuery(query);
    let { data, error } = await this.getWithClient(
      `${collection}/${id}${query}`,
      {
        next: { tags: [collection, "atlas::full-revalidation"] }
      }
    );
    if (error) {
      console.error(`Error fetching entry ${collection}:`, error, { query });
      return { data: void 0, error };
    }
    return await _utilsjs2.default.coerceData(data, collection, id);
  }
  async getSingle(collection, query = "", _hermes = this.hermes) {
    query = _utilsjs2.default.sanitizeQuery(query);
    let { data, error } = await this.getWithClient(`${collection}${query}`, {
      next: { tags: [collection, "atlas::full-revalidation"] }
    });
    if (error) {
      console.error(`Error fetching entry ${collection}:`, error, { query });
      return { data: void 0, error };
    }
    return await _utilsjs2.default.coerceData(data, collection);
  }
  get Hermes() {
    return this.hermes;
  }
  withContentTypes(options) {
    const { data: contentTypes, error } = _tsutils.runAsyncSynchronously.call(void 0, 
      _contentTypeSyncjs.downloadContentTypes,
      this.hermes,
      options
    );
    return this;
  }
  // STATIC FUNCTIONS
  static extractStrapiData(input) {
    return _utilsjs2.default.extractStrapiData(input);
  }
  extractStrapiData(input) {
    return _utilsjs2.default.extractStrapiData(input);
  }
  // extractStrapiData = StrapiUtils.extractStrapiData;
}
var strapiAdapter_default = StrapiContext;


exports.default = strapiAdapter_default;
