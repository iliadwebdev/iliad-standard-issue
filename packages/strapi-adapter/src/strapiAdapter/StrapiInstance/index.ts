// UTILS
import { createHermesInstance, parseStrapiInstanceParams } from "./utils";
import classes from "multiple-extend";

// TYPES
import type { ContentTypesSyncOptions } from "../ContentTypeSync/types";
import type { StrapiInstanceParams } from "./types";

// CLASSES
import ContentTypeSync from "../ContentTypeSync";
import Authentication from "../Authentication";
import StrapiAdapter from "../StrapiAdapter";

// https://strapi-sdk-js.netlify.app/api/
export interface StrapiInstance extends StrapiAdapter, ContentTypeSync {} // Tricking intellisense
export class StrapiInstance extends classes(
  ContentTypeSync,
  Authentication,
  StrapiAdapter
) {
  constructor(params: StrapiInstanceParams) {
    // Parse and validate the Strapi instance parameters, applying defaults where necessary.
    const { strapiApiLocation, strapiBearerToken, hermesOptions, client } =
      parseStrapiInstanceParams(params);

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
  static createStrapiContext(params: StrapiInstanceParams): StrapiInstance {
    return new StrapiInstance(params);
  }

  // FACTORY FUNCTIONS
  public label(label: string): StrapiInstance {
    this.hermes.setLabel(label);
    return this;
  }

  public withContentTypes(options: ContentTypesSyncOptions): StrapiInstance {
    super.withContentTypes(options);
    return this;
  }
}

export default StrapiInstance;
