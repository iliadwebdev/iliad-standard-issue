// Abstracting away a lot of the logic in the instance with more semantic, pure functions.
// More maintainable this way.

// Types
import { Hermes, HermesOptions } from "@iliad.dev/hermes";
import type { StrapiInstanceParams } from "./types";

// Utils
import { mergeDefaults } from "@iliad.dev/ts-utils";

// Data
import { defaultHermesOptions, defaultInstanceParams } from "./data";

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
export function parseStrapiInstanceParams(params: StrapiInstanceParams) {
  const { strapiApiLocation, strapiBearerToken, hermesOptions, client } =
    validateParams(params);

  return mergeDefaults<StrapiInstanceParams>(
    {
      strapiApiLocation: strapiApiLocation.toString(),
      strapiBearerToken: strapiBearerToken?.toString(),
      hermesOptions,
      client,
    },
    defaultInstanceParams
  ) as Recursive_Required<StrapiInstanceParams> & {
    strapiBearerToken: string | undefined;
    strapiApiLocation: string;
  };
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
