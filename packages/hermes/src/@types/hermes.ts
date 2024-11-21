import { AxiosInstance, AxiosRequestConfig } from "axios";

// Types
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

// Interfaces
interface HermesOptions {
  verboseLogging?: boolean;
  bustDevCache?: boolean;
  extractData?: boolean;
}

interface HermesMethod {
  AXIOS: "axios";
  FETCH: "fetch";
}

type StandardResponse<T> = SuccessResponse<T> | ErrorResponse;

interface HermesAxiosInstance
  extends Omit<AxiosInstance, "get" | "post" | "put" | "delete"> {
  // Custom Axios instance methods
  get<T>(url: string, data: any, options?: any): Promise<StandardResponse<T>>;
  post<T>(url: string, options?: any): Promise<StandardResponse<T>>;
  put<T>(url: string, data: any, options?: any): Promise<StandardResponse<T>>;
  delete<T>(url: string, options?: any): Promise<StandardResponse<T>>;
}

type Options = RequestInit | AxiosRequestConfig;

export {
  HermesAxiosInstance,
  StandardResponse,
  SuccessResponse,
  ErrorResponse,
  HermesOptions,
  ErrorMessage,
  HermesMethod,
  Options,
};
