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
import Options from "@classes/Options";

// https://strapi-sdk-js.netlify.app/api/
export interface StrapiInstance extends StrapiAdapter, ContentTypeSync {} // Tricking intellisense
export class StrapiInstance extends classes(
  ContentTypeSync,
  Authentication,
  StrapiAdapter
) {
  constructor(params: StrapiInstanceParams) {
    const options = new Options(params);
    super(options);
  }

  // STATIC CONSTRUCTOR
  static createStrapiContext(params: StrapiInstanceParams): StrapiInstance {
    return new StrapiInstance(params);
  }

  // FACTORY FUNCTIONS
  public label(label: string): StrapiInstance {
    this.options.hermes.setLabel(label);
    return this;
  }

  public withContentTypes(options: ContentTypesSyncOptions): StrapiInstance {
    super.withContentTypes(options);
    return this;
  }
}

export default StrapiInstance;
