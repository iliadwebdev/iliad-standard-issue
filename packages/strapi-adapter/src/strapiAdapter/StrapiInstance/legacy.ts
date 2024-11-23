// UTILS
import { createHermesInstance, parseStrapiInstanceParams } from "./utils";
import classes from "multiple-extend";

// TYPES
import type { ContentTypesSyncOptions } from "../ContentTypeSync/types";
import type { StrapiInstanceParams } from "./types";

// CLASSES
import ContentTypeSync from "../ContentTypeSync";
import Authentication from "../Authentication";
import LegacyStrapiAdapter from "../LegacyStrapiAdapter";

// https://strapi-sdk-js.netlify.app/api/

/**
 * LegacyStrapiInstance
 *
 * @deprecated All public methods in this class are deprecated. Access them through the `LegacyStrapiInstance` class.
 * Incremental adoption of the `StrapiInstance` class is recommended for new functionality.
 */
export interface LegacyStrapiInstance
  extends LegacyStrapiAdapter,
    ContentTypeSync {} // Tricking intellisense

/**
 * LegacyStrapiInstance
 *
 * @deprecated All public methods in this class are deprecated. Access them through the `LegacyStrapiInstance` class.
 * Incremental adoption of the `StrapiInstance` class is recommended for new functionality.
 */

export class LegacyStrapiInstance extends classes(
  LegacyStrapiAdapter,
  ContentTypeSync,
  Authentication
) {
  constructor(params: Omit<StrapiInstanceParams, "suppressLegacyApiWarning">) {
    const _params: StrapiInstanceParams = {
      ...params,
      suppressLegacyApiWarning: true, // Suppress the warning by default.
    };
    // Parse and validate the Strapi instance parameters, applying defaults where necessary.
    const { strapiApiLocation, strapiBearerToken, hermesOptions, client } =
      parseStrapiInstanceParams(_params);

    super({
      client, // Tell our Strapi Adapter what networking library to use.
      hermes: createHermesInstance(
        hermesOptions,
        strapiApiLocation,
        strapiBearerToken
      ),
    });
  }

  // STATIC CONSTRUCTOR
  static createStrapiContext(
    params: StrapiInstanceParams
  ): LegacyStrapiInstance {
    return new LegacyStrapiInstance(params);
  }

  // FACTORY FUNCTIONS
  public label(label: string): LegacyStrapiInstance {
    this.hermes.setLabel(label);
    return this;
  }

  public withContentTypes(
    options: ContentTypesSyncOptions
  ): LegacyStrapiInstance {
    super.withContentTypes(options);
    return this;
  }
}

export default LegacyStrapiInstance;
