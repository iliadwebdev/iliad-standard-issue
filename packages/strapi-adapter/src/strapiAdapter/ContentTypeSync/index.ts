import {
  normalizeContentTypesOptions,
  downloadContentTypesDynamic,
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

// This class facilitates the contentType syncronization feature.

class ContentTypeSync extends Feature {
  constructor(featureParams: FeatureParams) {
    super(featureParams);
  }

  async syncContentTypes(): Promise<StandardResponse<null>> {
    if (!this.contentTypesSyncOptions) {
      console.error("No content types sync options set.");
      return {
        data: undefined,
        error: { message: "No content types sync options set.", code: 500 },
      };
    }

    if (this.contentTypesSyncOptions.requestOnSync === true) {
      await requestNewContentTypes(this.hermes);
    }

    return downloadContentTypes(this.hermes, this.contentTypesSyncOptions);
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

  public withContentTypes(options: ContentTypesSyncOptions): void {
    const strictOptions = this.setContentTypesSyncOptions(options);
    downloadContentTypesDynamic(this.hermes, strictOptions);
  }

  async requestNewContentTypes(): Promise<StandardResponse<null>> {
    return requestNewContentTypes(this.hermes);
  }
}

export default ContentTypeSync;
export { ContentTypeSync };
export * from "./types";
