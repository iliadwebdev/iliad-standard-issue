export type ContentTypesResponse = [string, string];

export type ContentTypesSyncOptions = {
  blockOnFirstDownload?: boolean;
  logBlockReasons?: boolean;
  requestOnSync?: boolean;
  alwaysBlock?: boolean;
  outDir: string;
  names?: {
    contentTypes?: string;
    components?: string;
  };
};

export type StrictContentTypesSyncOptions =
  Legacy_Recursive_Required<ContentTypesSyncOptions>;

export type ContentTypeSyncParams = {
  // contentTypesSyncOptions: ContentTypesSyncOptions;
};
