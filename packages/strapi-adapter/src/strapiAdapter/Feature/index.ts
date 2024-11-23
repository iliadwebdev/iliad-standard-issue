import { Hermes } from "@iliad.dev/hermes";

import { StrictContentTypesSyncOptions } from "@features";
import { FeatureParams } from "./types";
import { ContextClient } from "@types";

// This is the base Feature class that holds information common to all features.
class Feature {
  protected contentTypesSyncOptions: Nullable<StrictContentTypesSyncOptions> =
    null;
  client: ContextClient = "axios"; // I should probably change this to fetch, given that most of the time this is being use in Next.js.
  hermes: Hermes;

  constructor({ client, hermes }: FeatureParams) {
    this.hermes = hermes;
    this.client = client;
  }

  protected withContentTypes(options: any): void {}
}

export * from "./types";
export default Feature;
export { Feature };
