import {
  Options,
  HermesMethod,
  HermesOptions,
  StandardResponse,
  HermesAxiosInstance,
} from './@types/hermes';

declare class Hermes {
  baseUrl?: string | null;
  baseQuery?: string | null;
  baseHeaders?: object | null;
  networkMethod?: HermesMethod | null;
  originLocation: string;
  hermesOptions: HermesOptions;
  axiosInstance: HermesAxiosInstance;

  constructor(originLocation: string, options: HermesOptions);
  // Methods
  fetch<T>(url: string, options?: Options): Promise<StandardResponse<T>>;

  // Getters
  deployEnvironment: string | undefined;
  environment: string | undefined;
  axios: HermesAxiosInstance;
  verbose: boolean;

  // Setters
  addBaseHeaders(headers: object): Hermes; // Returns Hermes instance for method chaining.
  addBaseQuery(query: string): Hermes; // Returns Hermes instance for method chaining.
  addBaseUrl(url: string): Hermes; // Returns Hermes instance for method chaining.
}

export { HermesOptions, Hermes };
