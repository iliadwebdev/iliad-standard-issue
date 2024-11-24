import { CTUID, CrudQuery } from "./types";
import qs from "qs";

export async function restOperation() {}

export async function crudOperation() {}

export function normalizeUrl(url: string | URL, api: boolean = true) {
  let str = url.toString();

  if (!api) return str;
  return str.startsWith("/api") ? str : `/api/${str}`;
}

type CreateUrlParams = {
  baseLocation?: string | URL;
  endpoint?: string | URL;
  query?: CrudQuery<any>;
};

export function createUrl({ endpoint, query }: CreateUrlParams) {
  let url = "";

  if (endpoint) {
    url += endpoint.toString();
  }

  if (query) {
    url += `?${qs.stringify(query)}`;
  }

  return url;
}

export function apiEndpoint(collection: string) {
  return `/api/${collection}`;
}

// async getCollectionTest<
// PN extends CollectionTypeNames,
// TContentTypeUID extends Common.UID.CollectionType = UIDFromPluralName<PN>,
// >(
// collection: PN,
// page: number = 1,
// pageSize: number = 25,
// query: QueryStringCollection<TContentTypeUID> = "",
// _hermes: Hermes = this.hermes
// ): Promise<StandardResponse<APIResponseCollection<TContentTypeUID>>> {
// let _q = StrapiUtils.sanitizeQuery(query, false);
// let __q = `?pagination[pageSize]=${pageSize}&pagination[page]=${page}`;

// if (_q) {
//   __q += `&${_q}`;
// }

// let { data, error } = await this.getWithClient(`${collection}${__q}`, {
//   next: { tags: [collection, "atlas::full-revalidation"] },
// });

// if (error) {
//   console.error(`Error fetching collection ${collection}:`, error, {
//     query: __q,
//   });
//   return { data: undefined, error } as ErrorResponse;
// }

// return await StrapiUtils.coerceData<TContentTypeUID>(data, collection);
// }
