import { AxiosInstance } from 'axios';
import { parse, stringify } from 'qs';
import { HermesMethod, HermesOptions, StandardResponse, HermesAxiosInstance } from '../@types/hermes.js';

declare const qs: {
    parse: typeof parse;
    stringify: typeof stringify;
};

declare class Hermes {
    baseUrl?: string | null;
    baseQuery?: string | null;
    baseHeaders?: object | null;
    networkMethod?: HermesMethod | null;
    originLocation: string;
    hermesOptions: HermesOptions;
    axiosInstance: AxiosInstance;
    constructor(options?: HermesOptions);
    private mergeHermesOptions;
    private normalizeResponse;
    private transformVerboseLog;
    private log;
    private error;
    private normalizeDataReturn;
    private mergeBaseHeadersWithOptions;
    private mergeDefaultFetchOptions;
    get verbose(): boolean;
    get qs(): typeof qs;
    get defaultFetchOptions(): RequestInit;
    private withBaseUrl;
    fetch<T>(input: string | URL, options?: RequestInit): Promise<StandardResponse<T>>;
    get deployEnvironment(): string | undefined;
    get environment(): "server" | "client";
    get axios(): HermesAxiosInstance;
    private sanitizeUrl;
    private sanitizeBaseUrl;
    addBaseUrl(url: string): Hermes;
    addBaseQuery(query: string): Hermes;
    addBaseHeaders(headers: object): Hermes;
    setLabel(label: string): Hermes;
}

export { Hermes as default };
