import {
  APIResponseCollection,
  APIResponseData,
  StrapiResponse,
  // INTERNAL TYPINGS
  StandardResponse,
  ContextClient,
  ErrorResponse,
} from "@types";
import { Hermes } from "@iliad.dev/hermes";
import { Common } from "@strapi/strapi";

import {
  QueryStringCollection,
  QueryStringEntry,
} from "../StrapiAdapter/types";
import { Feature, FeatureParams } from "../Feature";
import { StrapiUtils } from "@utils";

/**
 * LegacyStrapiAdapter
 *
 * @deprecated All public methods in this class are deprecated. Access them through the `LegacyStrapiInstance` class.
 * Incremental adoption of the `StrapiInstance` class is recommended for new functionality.
 */
class LegacyStrapiAdapter extends Feature {
  client: ContextClient = "axios"; // I should probably change this to fetch, given that most of the time this is being use in Next.js.
  hermes: Hermes;

  constructor(props: FeatureParams) {
    super(props);

    let { client, hermes } = props;
    this.hermes = hermes;
    this.client = client;
  }

  private async getWithClient<T extends Common.UID.ContentType>(
    url: string | URL,
    options?: any
  ): Promise<StandardResponse<StrapiResponse<T>>> {
    url = url as string;
    let response;

    if (this.client === "axios") {
      response = await this.hermes.axios.get(url, options);
      response = response.data;
    } else {
      response = await this.hermes.fetch(url, options);
    }

    return response as StandardResponse<StrapiResponse<T>>;
  }

  /**
   * Fetches the entire collection of data.
   * @deprecated This method is exposed through `LegacyStrapiInstance`. Incrementally adopt `StrapiInstance` for new functionality.
   */
  async getFullCollection<TContentTypeUID extends Common.UID.ContentType>(
    collection: string,
    query: QueryStringCollection<TContentTypeUID> = "",
    _hermes: Hermes = this.hermes
  ): Promise<StandardResponse<APIResponseCollection<TContentTypeUID>>> {
    query = StrapiUtils.sanitizeQuery(query);

    let data: APIResponseData<TContentTypeUID>[] = [];
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
          query,
        });
        return { data: undefined, error } as ErrorResponse;
      }

      if (!firstPage) {
        console.error(`No data returned from Strapi`);
        return {
          data: undefined,
          error: { message: "No data returned from Strapi", code: 500 },
        } as ErrorResponse;
      }

      meta = firstPage.meta;
      data = firstPage.data as APIResponseData<TContentTypeUID>[];
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
          query,
        });
        return { data: undefined, error } as ErrorResponse;
      }

      if (!page) {
        console.error(`No data returned from Strapi`);
        return {
          data: undefined,
          error: { message: "No data returned from Strapi", code: 500 },
        } as ErrorResponse;
      }

      return page.data as APIResponseData<TContentTypeUID>[];
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
        data,
      } as StrapiResponse<TContentTypeUID>,
      collection
    );
  }

  /**
   * Fetches an entry by its slug.
   * @deprecated This method is exposed through `LegacyStrapiInstance`. Incrementally adopt `StrapiInstance` for new functionality.
   */
  async getEntryBySlug<TContentTypeUID extends Common.UID.ContentType>(
    collection: string,
    slug: string,
    query: QueryStringEntry<TContentTypeUID> = "",
    _hermes: Hermes = this.hermes
  ): Promise<StandardResponse<APIResponseData<TContentTypeUID>>> {
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
      return { data: undefined, error } as ErrorResponse;
    }

    return await StrapiUtils.coerceData(data, collection, slug, true);
  }

  /**
   * Fetches a paginated collection.
   * @deprecated This method is exposed through `LegacyStrapiInstance`. Incrementally adopt `StrapiInstance` for new functionality.
   */
  async getCollection<TContentTypeUID extends Common.UID.CollectionType>(
    collection: string,
    page: number = 1,
    pageSize: number = 25,
    query: QueryStringCollection<TContentTypeUID> = "",
    _hermes: Hermes = this.hermes
  ): Promise<StandardResponse<APIResponseCollection<TContentTypeUID>>> {
    let _q = StrapiUtils.sanitizeQuery(query, false);
    let __q = `?pagination[pageSize]=${pageSize}&pagination[page]=${page}`;

    if (_q) {
      __q += `&${_q}`;
    }

    let { data, error } = await this.getWithClient(`${collection}${__q}`, {
      next: { tags: [collection, "atlas::full-revalidation"] },
    });

    if (error) {
      console.error(`Error fetching collection ${collection}:`, error, {
        query: __q,
      });
      return { data: undefined, error } as ErrorResponse;
    }

    return await StrapiUtils.coerceData(data, collection as string);
  }

  /**
   * Fetches a single entry by its ID.
   * @deprecated This method is exposed through `LegacyStrapiInstance`. Incrementally adopt `StrapiInstance` for new functionality.
   */
  async getEntry<TContentTypeUID extends Common.UID.ContentType>(
    collection: string,
    id: number,
    query: QueryStringCollection<TContentTypeUID> = "",
    _hermes: Hermes = this.hermes
  ): Promise<StandardResponse<APIResponseData<TContentTypeUID>>> {
    query = StrapiUtils.sanitizeQuery(query);

    let { data, error } = await this.getWithClient(
      `${collection}/${id}${query}`,
      {
        next: { tags: [collection, "atlas::full-revalidation"] },
      }
    );

    if (error) {
      console.error(`Error fetching entry ${collection}:`, error, { query });
      return { data: undefined, error } as ErrorResponse;
    }

    return await StrapiUtils.coerceData(data, collection, id);
  }

  /**
   * Fetches a single entry of a content type.
   * @deprecated This method is exposed through `LegacyStrapiInstance`. Incrementally adopt `StrapiInstance` for new functionality.
   */
  async getSingle<TContentTypeUID extends Common.UID.ContentType>(
    collection: string,
    query: QueryStringCollection<TContentTypeUID> = "",
    _hermes: Hermes = this.hermes
  ): Promise<StandardResponse<APIResponseData<TContentTypeUID>>> {
    query = StrapiUtils.sanitizeQuery(query);

    let { data, error } = await this.getWithClient(`${collection}${query}`, {
      next: { tags: [collection, "atlas::full-revalidation"] },
    });

    if (error) {
      console.error(`Error fetching entry ${collection}:`, error, { query });
      return { data: undefined, error } as ErrorResponse;
    }

    return await StrapiUtils.coerceData(data, collection);
  }

  protected withContentTypes(options: any): void {}
}

export default LegacyStrapiAdapter;
export { LegacyStrapiAdapter };
