import prettyBytes from "pretty-bytes";
import deepmerge from "deepmerge";

import { Hermes } from "@iliad.dev/hermes";
import fs, { write } from "fs";
type ContentTypesResponse = [string, string];

const defaultContentTypesSyncOptions: Recursive_OptionalFieldsOf<ContentTypesSyncOptions> =
  {
    blockOnFirstDownload: true,
    requestOnSync: false,
    names: {
      contentTypes: "contentTypes.d.ts",
      components: "components.d.ts",
    },
  };

export type ContentTypesSyncOptions = {
  blockOnFirstDownload?: boolean;
  requestOnSync?: boolean;
  outDir: string;
  names?: {
    contentTypes?: string;
    components?: string;
  };
};

export type StrictContentTypesSyncOptions =
  Recursive_Required<ContentTypesSyncOptions>;

function writeContentTypes(
  options: StrictContentTypesSyncOptions,
  data: ContentTypesResponse
): StandardResponse<string> {
  const { outDir, names } = options;
  const [contentTypes, components] = data;

  try {
    fs.writeFileSync(`${outDir}/${names.contentTypes}`, contentTypes, {
      encoding: "utf8",
    });
    fs.writeFileSync(`${outDir}/${names.components}`, components, {
      encoding: "utf8",
    });
  } catch (error) {
    console.error("Error writing content types", error);
    return {
      data: undefined,
      error: {
        message: "Error writing content types",
        code: 500,
      },
    };
  }

  const contentTypesSize = Buffer.byteLength(contentTypes, "utf8");
  const componentsSize = Buffer.byteLength(components, "utf8");

  const diskSize = prettyBytes(contentTypesSize + componentsSize);
  return { data: diskSize, error: undefined };
}

export async function requestNewContentTypes(
  hermes: Hermes
): Promise<StandardResponse<null>> {
  const { data, error } = await hermes.axios.post<string>("/content-types");
  if (error !== undefined) {
    console.error("Error requesting new content types", error);
    return { error };
  }

  console.log("New content types requested", data);
  return { data: null };
}

export async function downloadContentTypes(
  hermes: Hermes,
  options: StrictContentTypesSyncOptions,
  start: number = performance.now()
): Promise<StandardResponse<null>> {
  const { data: $1data, error: $1error } =
    await hermes.axios.get<ContentTypesResponse>("/content-types");
  if ($1error !== undefined) {
    console.error("Error downloading content types", $1error);
    return { error: $1error };
  }

  console.log(Object.keys($1data));

  const { data: diskSize, error: $2error } = writeContentTypes(
    options,
    $1data.data
  );
  if ($2error !== undefined) {
    console.error("Error writing content types", $2error);
    return { error: $2error };
  }

  const ts = (performance.now() - start).toFixed(2);
  console.log(
    `Content types downloaded and written to disk (${diskSize}) in ${ts}ms`
  );

  return { data: null };
}

export function downloadContentTypesSync(
  hermes: Hermes,
  options: StrictContentTypesSyncOptions
): StandardResponse<null> {
  const start = performance.now();

  const ctExists = doContentTypesExist(options);
  if (!ctExists && options.blockOnFirstDownload) {
    console.log("Content types already exist. Downloading asyncronously.");
    downloadContentTypes(hermes, options, start);
  } else {
    console.log(
      "Content types not found. Blocking until initial download is complete. To disable this behavior, set the `blockOnFirstDownload` option of `withContentTypes` to `false`."
    );
  }

  return { data: null };
}

export function doContentTypesExist({
  outDir,
  names,
}: StrictContentTypesSyncOptions): boolean {
  if (!fs.existsSync(outDir)) return false;

  const files = fs.readdirSync(outDir);
  return files.includes(names.contentTypes) && files.includes(names.components);
}

export function normalizeContentTypesOptions(
  options: ContentTypesSyncOptions
): StrictContentTypesSyncOptions {
  const merged = deepmerge(defaultContentTypesSyncOptions, options);
  return merged as StrictContentTypesSyncOptions; // I'm not spending eighteen hours making this type-safe
}
