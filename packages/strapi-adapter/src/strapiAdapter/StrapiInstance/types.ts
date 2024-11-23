// All types specific to the Strapi Instance will live here, for now.
import type { StringLike, ContextClient } from "@types";
import type { HermesOptions } from "@iliad.dev/hermes";

export type StrapiInstanceParams = {
  strapiApiLocation: StringLike;
  strapiBearerToken?: StringLike;
  hermesOptions?: HermesOptions;
  client?: ContextClient;

  // Warnings
  suppressLegacyApiWarning?: boolean;
};
