import { StrictContentTypesSyncOptions } from "@features";
import { WarningConfig } from "../StrapiInstance/types";
import { Hermes } from "@iliad.dev/hermes";
import Options from "@classes/Options";

// This is the base Feature class that holds information common to all features.
class Feature {
  protected contentTypesSyncOptions: Nullable<StrictContentTypesSyncOptions> =
    null;

  options: Options;
  warnings: WarningConfig;
  hermes: Hermes;

  constructor(options: Options) {
    this.warnings = options.warnings;
    this.hermes = options.hermes;

    // Options need to be considered a static object, for the most part.
    this.options = options;
  }

  protected withContentTypes(options: any): void {}
}

export * from "./types";
export default Feature;
export { Feature };
