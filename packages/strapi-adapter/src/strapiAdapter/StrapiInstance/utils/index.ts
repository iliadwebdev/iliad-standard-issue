// Abstracting away a lot of the logic in the instance with more semantic, pure functions.
// More maintainable this way.

// Types
import type {
  PopulatedStrapiInstanceParams,
  StrapiInstanceParams,
  WarningConfig,
} from "../types";
import { Hermes, HermesOptions } from "@iliad.dev/hermes";

// Utils
import { mergeDefaults } from "@iliad.dev/ts-utils";
import warnings from "./warnings";

// Data
import { normalizeContentTypesOptions } from "../../ContentTypeSync/utils";
import { defaultHermesOptions, defaultInstanceParams } from "../data";

// Create new Hermes instance with the Strapi API location as the base URL.
// And applies the default options to the instance, if not provided.
export function createHermesInstance(
  options: HermesOptions = {},
  apiLocation: string,
  apiToken?: string
): Hermes {
  const mergedOptions = mergeDefaults<HermesOptions>(
    options,
    defaultHermesOptions
  );

  const hermes = new Hermes(mergedOptions).addBaseUrl(apiLocation);

  // If an API token is provided, add it to the base headers.
  if (apiToken) {
    hermes.addBaseHeaders({
      Authorization: `Bearer ${apiToken}`,
    });
  }

  return hermes;
}

// Parse the Strapi instance parameters.
export function parseStrapiInstanceParams(
  params: StrapiInstanceParams
): PopulatedStrapiInstanceParams {
  const {
    contentTypesSyncOptions,
    strapiApiEndpoint,
    strapiApiLocation,
    strapiBearerToken,
    hermesOptions,
    client,
  } = validateParams(params);

  warnings.warnIfLegacyPattern(
    params.warnings as WarningConfig,
    strapiApiLocation
  );

  const ctso = normalizeContentTypesOptions(
    contentTypesSyncOptions || {
      outDir: undefined,
    }
  );

  return mergeDefaults<
    StrapiInstanceParams,
    Legacy_Recursive_Required<StrapiInstanceParams>
  >(
    {
      strapiBearerToken: strapiBearerToken?.toString(),
      strapiApiEndpoint: strapiApiEndpoint?.toString(),
      strapiApiLocation: strapiApiLocation.toString(),
      contentTypesSyncOptions: ctso,
      hermesOptions,
      client,
    },
    defaultInstanceParams
  ) as PopulatedStrapiInstanceParams;
}

// Validate the Strapi instance parameters.
// As of right now, we only need to check if the API location is a valid URL.
export function validateParams(
  params: StrapiInstanceParams
): StrapiInstanceParams & { strapiApiLocation: string } {
  if (!params.strapiApiLocation) {
    throw new Error("Strapi API location is required.");
  }

  let apiLocation = params.strapiApiLocation;

  try {
    apiLocation = new URL(params.strapiApiLocation).toString();
  } catch (_) {
    throw new Error("Invalid Strapi API location.");
  }

  return {
    ...params,
    strapiApiLocation: apiLocation,
  };
}

export { warnings };
