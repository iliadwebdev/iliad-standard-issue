import type {
  APIResponseCollectionMetadata,
  APIResponseCollection,
  APIResponseData,
  StrapiResponse,
  APIResponse,
  Common,
} from "./strapi";

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

export type StringLike = string | EnvVariable | URL;
type EnvVariable = string | undefined;

type StandardResponse<T> = SuccessResponse<T> | ErrorResponse;
type StrapiResponseType = "entry" | "collection";

export type ContextClient = "axios" | "fetch";

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
