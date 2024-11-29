import {
  normalizeContentTypesOptions,
  requestNewContentTypes,
  downloadContentTypes,
  doContentTypesExist,
} from "./utils";

import { Hermes } from "@iliad.dev/hermes";

import {
  StrictContentTypesSyncOptions,
  ContentTypesSyncOptions,
} from "./types";
import { FeatureParams } from "../Feature/types";
import { Feature } from "../Feature";
import Options from "@classes/Options";

// This class facilitates the contentType syncronization feature.

class ContentTypeSync extends Feature {
  constructor(options: Options) {
    super(options);
  }

  async syncContentTypes(): Promise<StandardResponse<null>> {
    if (this.options.contentTypesSyncOptions === undefined) {
      console.error("No content types sync options set.");
      return {
        data: undefined,
        error: { message: "No content types sync options set.", code: 500 },
      };
    }

    if (this.options.contentTypesSyncOptions.requestOnSync === true) {
      await requestNewContentTypes(this.hermes, this.contentTypeEndpoint);
    }

    return downloadContentTypes(
      this.hermes,
      this.options.contentTypesSyncOptions,
      this.contentTypeEndpoint
    );
  }

  get Hermes(): Hermes {
    return this.hermes;
  }

  get contentTypesExist(): boolean {
    if (!this.contentTypesSyncOptions) {
      return false;
    }
    return doContentTypesExist(this.contentTypesSyncOptions);
  }

  private setContentTypesSyncOptions(
    options: ContentTypesSyncOptions
  ): StrictContentTypesSyncOptions {
    return normalizeContentTypesOptions(options);
  }

  private get contentTypeEndpoint(): string {
    const endpoint = super.apiEndpoint(
      this.options.contentTypesSyncOptions.contentTypesEndpoint
    );
    console.log("endpoint", endpoint);
    return endpoint;
  }

  async requestNewContentTypes(): Promise<StandardResponse<null>> {
    return requestNewContentTypes(this.hermes, this.contentTypeEndpoint);
  }
}

export default ContentTypeSync;
export { ContentTypeSync };
export * from "./types";
