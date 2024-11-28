// All types specific to the Strapi Instance will live here, for now.
import type { StringLike, ContextClient } from "@types";
import type { HermesOptions } from "@iliad.dev/hermes";

export type StrapiInstanceParams = {
  strapiBearerToken?: StringLike;
  strapiApiEndpoint?: StringLike;
  strapiApiLocation: StringLike;
  hermesOptions?: HermesOptions;
  client?: ContextClient;

  normalizeStrapiData?: boolean; // Whether or not to place all Strapi responses inside an array with a key of "data".

  // Warnings
  warnings?: {
    suppressNormalizeStrapiData?: boolean;
    suppressLegacyApiWarning?: boolean;
    suppressAxiosWarning?: boolean;
  };
};

export type PopulatedStrapiInstanceParams =
  Legacy_Recursive_Required<StrapiInstanceParams> & {
    strapiBearerToken: string | undefined;
    strapiApiLocation: string;
    strapiApiEndpoint: string;
  };

export type WarningConfig = boolean | PopulatedStrapiInstanceParams["warnings"];
export type WarningKeys = keyof PopulatedStrapiInstanceParams["warnings"];
export type WarningFn<Args extends any[]> = (
  wConfig: WarningConfig,
  ...args: Args
) => void;
