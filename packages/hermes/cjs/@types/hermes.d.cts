import { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';

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
type HermesRequestInit<M = HermesMethod> = M extends HermesMethod["AXIOS"] ? AxiosRequestConfig : RequestInit;
type HermesAxiosResponse<T> = Promise<StandardResponse<AxiosResponse<T>>>;
type StandardResponse<T> = SuccessResponse<T> | ErrorResponse;
interface HermesAxiosInstance extends Omit<AxiosInstance, "get" | "post" | "put" | "delete"> {
    post<T = any, R = HermesAxiosResponse<T>, D = any>(url: string, data: D, options?: AxiosRequestConfig<D>): R;
    put<T = any, R = HermesAxiosResponse<T>, D = any>(url: string, data: D, options?: AxiosRequestConfig<D>): R;
    delete<T = any, R = HermesAxiosResponse<T>>(url: string, options?: AxiosRequestConfig<T>): R;
    get<T = any, R = HermesAxiosResponse<T>>(url: string, options?: AxiosRequestConfig<T>): R;
}
type Options = RequestInit | AxiosRequestConfig;

export type { ErrorMessage, ErrorResponse, HermesAxiosInstance, HermesMethod, HermesOptions, HermesRequestInit, Options, StandardResponse, SuccessResponse };
