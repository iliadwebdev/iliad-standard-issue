// This is where we'll store configurations and constants for the Instance.
import { HermesOptions } from "@iliad.dev/hermes";
import { StrapiInstanceParams } from "./types";
import { defaultContentTypesSyncOptions } from "../ContentTypeSync/data";
import { DefaultParams } from "@iliad.dev/ts-utils";

export const defaultHermesOptions: DefaultParams<HermesOptions> = {
  originLocation: undefined,
  verboseLogging: false,
  bustDevCache: false,
  extractData: false,
};

export const defaultInstanceParams: DefaultParams<StrapiInstanceParams> = {
  contentTypesSyncOptions: defaultContentTypesSyncOptions,
  hermesOptions: defaultHermesOptions,
  strapiBearerToken: undefined,
  normalizeStrapiData: false,
  strapiApiEndpoint: "/api",
  label: "Strapi Adapter",
  client: "axios",

  // Warnings
  warnings: {
    suppressNormalizeStrapiData: false,
    suppressLegacyApiWarning: false,
    suppressAxiosWarning: false,
  },
};
