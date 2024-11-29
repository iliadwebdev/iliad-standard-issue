export type ContentTypesResponse = Array<string>;

export type ContentTypesSyncOptions = {
  blockOnFirstDownload?: boolean;
  contentTypesEndpoint?: string;
  outDir: string | undefined;
  logBlockReasons?: boolean;
  requestOnSync?: boolean;
  alwaysBlock?: boolean;
  names?: {
    contentTypes?: string;
    components?: string;
    api?: string;
  };
};

export type StrictContentTypesSyncOptions =
  Legacy_Recursive_Required<ContentTypesSyncOptions>;

export type ContentTypeSyncParams = {
  // contentTypesSyncOptions: ContentTypesSyncOptions;
};
