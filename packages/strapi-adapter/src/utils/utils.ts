// Dependencies
import qs from "qs";

// Types
import type {
  StrapiData,
  StrapiEntry,
  ContextClient,
  StrapiMetaData,
  StrapiResponse,
  StrapiDataObject,
  StrapiResponseType,
} from "../@types/adapter";
import { ErrorResponse } from "@iliad.dev/ts-utils";

import type {
  Common,
  APIResponse,
  APIResponseData,
  APIResponseCollection,
} from "../@types/strapi";
import { type HermesOptions } from "@iliad.dev/hermes";

// Utils

type StrapiDataInput<T extends Common.UID.ContentType> =
  | APIResponse<T>
  | APIResponseCollection<T>
  | APIResponseData<T>;

type oStrapiDataInput<T extends Common.UID.ContentType> =
  | StrapiDataInput<T>
  | {
      [key: string]: StrapiDataInput<T>;
    };

// ============
// SHARED UTILS
// ============
namespace StrapiUtils {
  export function sanitizeQuery(
    query: string | object = "",
    addQueryPrefix: boolean = true
  ): string {
    // If query is an object, convert it to a string
    if (typeof query === "object") {
      query = qs.stringify(query);
    }

    // If query starts with an ampersand, remove it - this is to prevent polluting query through nested sanitization.
    query = query.startsWith("&") ? query.slice(1) : query;

    let qp = addQueryPrefix ? "?" : "";
    query ? (query = `${qp}${query}`) : (query = "");

    return query.replaceAll("&?", "&"); // Monkey patch, this sanitization function needs to be revisited.
  }
  export function mergeQueries(...queries: any[]) {}
  export async function coerceData<T extends Common.UID.ContentType>(
    data: any = null,
    collection: string,
    id?: number | string,
    extractSingleCollectionResponse: boolean = false,
    client?: ContextClient
  ): Promise<
    | {
        data: any;
        error?: undefined;
      }
    | ErrorResponse
  > {
    let result: StrapiEntry | Array<StrapiEntry> | StrapiResponse<T>;
    let apiResponse: StrapiResponse<T>;
    let type: StrapiResponseType;

    try {
      if (!data) throw new Error("No data returned from Strapi");
      apiResponse = data as StrapiResponse<T>;

      type = "attributes" in apiResponse?.data ? "entry" : "collection";
    } catch (error: any) {
      console.error(
        `Error parsing entry ${collection}/${id}: ${error.message}`
      );
      return { data: undefined, error } as ErrorResponse;
    }

    if (type === "entry") {
      result = apiResponse.data;
    } else {
      if (extractSingleCollectionResponse) {
        if (Array.isArray(apiResponse.data)) {
          result = apiResponse.data[0] as StrapiEntry;
        } else {
          result = apiResponse.data as StrapiEntry;
        }
      } else {
        result = apiResponse;
      }
    }

    return { data: result, error: undefined } as
      | {
          data: StrapiEntry;
          error?: undefined;
        }
      | ErrorResponse;
  }

  export function indexArrayFromMeta(meta: StrapiMetaData): number[] {
    return Array(meta.pagination.pageCount)
      .fill(0)
      .map((_, i) => i + 2)
      .slice(0, meta.pagination.pageCount - 1);
  }

  export function mergeDefaultHermesOptions(
    options: Partial<HermesOptions> = {}
  ): HermesOptions {
    return {
      verboseLogging: false,
      extractData: false,
      ...options,
    } as HermesOptions;
  }

  export async function extractStrapiData<
    TContentTypeUID extends Common.UID.ContentType,
  >(input: StrapiData<TContentTypeUID> | StrapiDataObject<TContentTypeUID>) {
    function isObject(obj: any) {
      return obj !== null && typeof obj === "object";
    }

    function isArray(obj: any) {
      return Array.isArray(obj);
    }

    function isEntryObject(value: any) {
      return isObject(value) && "id" in value && "attributes" in value;
    }

    function isRelation(value: any): boolean {
      if (!("data" in value)) return false;

      if (
        isArray(value.data) &&
        value.data.every(
          (item: any) => isObject(item) && "id" in item && "attributes" in item
        )
      )
        return true;
      if (
        isObject(value.data) &&
        "id" in value.data &&
        "attributes" in value.data
      )
        return true;

      return false;
    }

    async function recursivelyExtractAttributes(input: any): Promise<any> {
      switch (true) {
        case isArray(input): {
          const a_promises = input.map(async (item: any) =>
            recursivelyExtractAttributes(item)
          );
          return await Promise.all(a_promises);
        }
        case isObject(input): {
          let _input = { ...input };

          if (isRelation(input)) {
            return await recursivelyExtractAttributes(input.data);
          }

          if (isEntryObject(input)) {
            const { id, attributes, ...rest } = input;
            _input = {
              ...{
                id,
                ...attributes,
              },
              ...rest,
            };
          }

          const e_promises = Object.entries(_input).map(
            async ([key, value]: [string, any]) => [
              key,
              await recursivelyExtractAttributes(value),
            ]
          );

          return Object.fromEntries(await Promise.all(e_promises));
        }
        default: {
          return input;
        }
      }
    }

    let initialInput;
    if ((input as any)?.data) {
      initialInput = (input as any).data;
    } else {
      initialInput = input;
    }

    return await recursivelyExtractAttributes(initialInput);
  }
}

export default StrapiUtils;
