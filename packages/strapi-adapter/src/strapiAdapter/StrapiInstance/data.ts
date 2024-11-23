// This is where we'll store configurations and constants for the Instance.
import { HermesOptions } from "@iliad.dev/hermes";
import { StrapiInstanceParams } from "./types";

export const defaultHermesOptions: DefaultParams<HermesOptions> = {
  originLocation: undefined,
  verboseLogging: false,
  bustDevCache: false,
  extractData: false,
};

export const defaultInstanceParams: DefaultParams<StrapiInstanceParams> = {
  hermesOptions: defaultHermesOptions,
  strapiBearerToken: undefined,
  client: "axios",
};
