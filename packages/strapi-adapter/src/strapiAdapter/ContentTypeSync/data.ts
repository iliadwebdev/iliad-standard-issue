import { ContentTypesSyncOptions } from "./types";

export const defaultContentTypesSyncOptions: Recursive_OptionalFieldsOf<ContentTypesSyncOptions> =
  {
    contentTypesEndpoint: "/content-types",
    blockOnFirstDownload: true,
    logBlockReasons: false,
    requestOnSync: false,
    alwaysBlock: false,
    names: {
      contentTypes: "contentTypes.d.ts",
      components: "components.d.ts",
      api: "api.d.ts",
    },
  };
