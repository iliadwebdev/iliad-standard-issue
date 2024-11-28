import type { StringLike, ContextClient } from "@types";
import type { Hermes, HermesOptions } from "@iliad.dev/hermes";

import {
  PopulatedStrapiInstanceParams,
  StrapiInstanceParams,
  WarningConfig,
  WarningKeys,
} from "../../strapiAdapter/StrapiInstance/types";
import {
  parseStrapiInstanceParams,
  createHermesInstance,
} from "../../strapiAdapter/StrapiInstance/utils";

// Options hold the configuration for the Strapi Instance provided by the user.
class Options {
  // API Information and Configuration
  strapiApiLocation: StringLike;
  strapiBearerToken: StringLike;
  api: string;

  // Hermes Configuration
  hermesOptions: HermesOptions;
  client: ContextClient;
  hermes: Hermes;

  // Strapi Adapter Options
  normalizeStrapiResponse: boolean;
  warnings: WarningConfig;

  constructor(params: StrapiInstanceParams) {
    const {
      normalizeStrapiResponse,
      strapiApiLocation,
      strapiBearerToken,
      strapiApiEndpoint,
      hermesOptions,
      warnings,
      client,
    } = parseStrapiInstanceParams(params);
    this.hermes = createHermesInstance(
      hermesOptions,
      strapiApiLocation,
      strapiBearerToken
    );

    this.strapiApiLocation = strapiApiLocation;
    this.strapiBearerToken = strapiBearerToken;
    this.normalizeStrapiResponse = normalizeStrapiResponse;
    this.hermesOptions = hermesOptions;
    this.api = strapiApiEndpoint;
    this.warnings = warnings;
    this.client = client;
  }

  // My Request.body, my Request.choice!
  protected objectify() {
    return {
      strapiApiLocation: this.strapiApiLocation,
      strapiBearerToken: this.strapiBearerToken,
      hermesOptions: this.hermesOptions,
      warnings: this.warnings,
      client: this.client,
      hermes: this.hermes,
      api: this.api,
    };
  }
}

export default Options;
export { Options };
