import {
  __publicField
} from "../chunk-PKBMQBKP.js";
import {
  downloadContentTypes,
  requestNewContentTypes,
  downloadContentTypesSync,
  normalizeContentTypesOptions,
  doContentTypesExist
} from "./contentTypeSync";
import { Hermes } from "@iliad.dev/hermes";
import StrapiUtils from "../utils/utils.js";
class StrapiContext {
  constructor(strapiApiLocation, strapiBearerToken, client, options) {
    __publicField(this, "contentTypesSyncOptions", null);
    __publicField(this, "client", "axios");
    __publicField(this, "hermes");
    this.hermes = new Hermes(
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
  static createStrapiContext(strapiApiLocation, strapiBearerToken, options) {
    return new StrapiContext(
      strapiApiLocation,
      strapiBearerToken,
      void 0,
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
  async requestNewContentTypes() {
    return requestNewContentTypes(this.hermes);
  }
  async syncContentTypes() {
    if (!this.contentTypesSyncOptions) {
      console.error("No content types sync options set.");
      return {
        data: void 0,
        error: { message: "No content types sync options set.", code: 500 }
      };
    }
    if (this.contentTypesSyncOptions.requestOnSync === true) {
      await this.requestNewContentTypes();
    }
    return downloadContentTypes(this.hermes, this.contentTypesSyncOptions).then((response) => {
      return {
        data: null,
        error: void 0
      };
    }).catch((error) => {
      console.error("Error syncing content types:", error);
      return {
        data: void 0,
        error
      };
    });
  }
  get Hermes() {
    return this.hermes;
  }
  get contentTypesExist() {
    if (!this.contentTypesSyncOptions) {
      return false;
    }
    return doContentTypesExist(this.contentTypesSyncOptions);
  }
  // STATIC FUNCTIONS
  static extractStrapiData(input) {
    return StrapiUtils.extractStrapiData(input);
  }
  extractStrapiData(input) {
    return StrapiUtils.extractStrapiData(input);
  }
  // FACTORY FUNCTIONS
  withContentTypes(options) {
    const strictOptions = this.setContentTypesSyncOptions(options);
    downloadContentTypesSync(this.hermes, strictOptions);
    return this;
  }
  label(label) {
    this.hermes.setLabel(label);
    return this;
  }
  // Setters
  setContentTypesSyncOptions(options) {
    this.contentTypesSyncOptions = normalizeContentTypesOptions(options);
    return this.contentTypesSyncOptions;
  }
}
var strapiAdapter_default = StrapiContext;
export {
  strapiAdapter_default as default
};
