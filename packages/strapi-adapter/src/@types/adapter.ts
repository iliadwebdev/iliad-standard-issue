import type {
  APIResponseCollection,
  APIResponseData,
  StrapiResponse,
  APIResponse,
  Common,
} from "./strapi";

export type Flavor = "crud" | "rest" | "semantic";

type ErrorMessage = {
  message: string;
  code: number;
};

type StrapiEntry = {
  attributes: any;
  id: number;
};

type TransformedStrapiEntry = {
  [key: string]: any;
  id: number;
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

type StrapiResponseType = "entry" | "collection";

export type ContextClient = "axios" | "fetch";

export type StrapiData<T extends Common.UID.ContentType> =
  | APIResponseCollection<T>
  | APIResponseData<T>
  | APIResponse<T>;

export type StrapiDataObject<T extends Common.UID.ContentType> = {
  [key: string]: StrapiData<T>;
};

export {
  TransformedStrapiEntry,
  StrapiResponseType,
  StrapiResponse,
  StrapiMetaData,
  ErrorMessage,
  EnvVariable,
  StrapiEntry,
};
