import {
  __publicField
} from "../chunk-QZ7TP4HQ.mjs";
import { runAsyncSynchronously } from "@iliad.dev/ts-utils";
import { downloadContentTypes } from "./contentTypeSync.js";
import "@iliad.dev/ts-utils/@types";
import { Hermes } from "@iliad.dev/hermes";
import StrapiUtils from "../utils/utils.js";
class StrapiContext {
  constructor(contextLabel, strapiApiLocation, strapiBearerToken, client, options) {
    __publicField(this, "hermes");
    __publicField(this, "client", "axios");
    this.hermes = new Hermes(
      contextLabel,
      StrapiUtils.mergeDefaultHermesOptions(options)
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
    query = StrapiUtils.sanitizeQuery(query);
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
    let indexArray = StrapiUtils.indexArrayFromMeta(meta);
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
    return await StrapiUtils.coerceData(
      {
        meta,
        data
      },
      collection
    );
  }
  async getEntryBySlug(collection, slug, query = "", _hermes = this.hermes) {
    let _q = StrapiUtils.sanitizeQuery(query, false);
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
    return await StrapiUtils.coerceData(data, collection, slug, true);
  }
  async getCollection(collection, page = 1, pageSize = 25, query = "", _hermes = this.hermes) {
    let _q = StrapiUtils.sanitizeQuery(query, false);
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
    return await StrapiUtils.coerceData(data, collection);
  }
  async getEntry(collection, id, query = "", _hermes = this.hermes) {
    query = StrapiUtils.sanitizeQuery(query);
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
    return await StrapiUtils.coerceData(data, collection, id);
  }
  async getSingle(collection, query = "", _hermes = this.hermes) {
    query = StrapiUtils.sanitizeQuery(query);
    let { data, error } = await this.getWithClient(`${collection}${query}`, {
      next: { tags: [collection, "atlas::full-revalidation"] }
    });
    if (error) {
      console.error(`Error fetching entry ${collection}:`, error, { query });
      return { data: void 0, error };
    }
    return await StrapiUtils.coerceData(data, collection);
  }
  get Hermes() {
    return this.hermes;
  }
  withContentTypes(options) {
    const { data: contentTypes, error } = runAsyncSynchronously(
      downloadContentTypes,
      this.hermes,
      options
    );
    return this;
  }
  // STATIC FUNCTIONS
  static extractStrapiData(input) {
    return StrapiUtils.extractStrapiData(input);
  }
  extractStrapiData(input) {
    return StrapiUtils.extractStrapiData(input);
  }
  // extractStrapiData = StrapiUtils.extractStrapiData;
}
var strapiAdapter_default = StrapiContext;
export {
  strapiAdapter_default as default
};
