import type {
  APIResponseCollectionMetadata,
  APIResponseCollection,
  APIResponseData,
  StrapiResponse,
  APIResponse,
  Common,
} from "./strapi.d.ts";

type ErrorMessage = {
  message: string;
  code: number;
};

type SuccessResponse<T> = {
  data: T;
  error: undefined;
};

type ErrorResponse = {
  data: undefined;
  error: ErrorMessage;
};

type NotFoundResponse = ErrorResponse & {
  error: ErrorMessage & { code: 404 };
};

type StrapiEntry = {
  id: number;
  attributes: any;
};

type TransformedStrapiEntry = {
  id: number;
  [key: string]: any;
};

type StrapiMetaData = {
  pagination: {
    pageCount: number;
    pageSize: number;
    total: number;
    page: number;
  };
  [key: string]: any;
};

// type StrapiResponse = {
//   meta: StrapiMetaData;
//   data: StrapiEntry | Array<StrapiEntry>;
// };

type EnvVariable = string | undefined;

type StrapiResponseType = "entry" | "collection";

type StandardResponse<T> = SuccessResponse<T> | ErrorResponse;

export type ContextClient = "axios" | "fetch";

// export type StrapiData = StrapiResponse | StrapiEntry | StrapiEntry[];
export type StrapiData<T extends Common.UID.ContentType> =
  | APIResponseCollection<T>
  | APIResponse<T>
  | APIResponseData<T>;
export type StrapiDataObject<T extends Common.UID.ContentType> = {
  [key: string]: StrapiData<T>;
};

export {
  TransformedStrapiEntry,
  StrapiResponseType,
  StandardResponse,
  SuccessResponse,
  StrapiResponse,
  StrapiMetaData,
  ErrorResponse,
  ErrorMessage,
  EnvVariable,
  StrapiEntry,
};
