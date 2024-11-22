import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

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
interface HermesOptions {
    verboseLogging?: boolean;
    originLocation?: string;
    bustDevCache?: boolean;
    extractData?: boolean;
}
interface HermesMethod {
    AXIOS: "axios";
    FETCH: "fetch";
}
type HermesAxiosResponse<T> = Promise<StandardResponse<AxiosResponse<T>>>;
type StandardResponse<T> = SuccessResponse<T> | ErrorResponse;
interface HermesAxiosInstance extends Omit<AxiosInstance, "get" | "post" | "put" | "delete"> {
    put<T>(url: string, data: any, options?: any): HermesAxiosResponse<T>;
    delete<T>(url: string, options?: any): HermesAxiosResponse<T>;
    post<T>(url: string, options?: any): HermesAxiosResponse<T>;
    get<T>(url: string, options?: any): HermesAxiosResponse<T>;
}
type Options = RequestInit | AxiosRequestConfig;

export type { ErrorMessage, ErrorResponse, HermesAxiosInstance, HermesMethod, HermesOptions, Options, StandardResponse, SuccessResponse };
