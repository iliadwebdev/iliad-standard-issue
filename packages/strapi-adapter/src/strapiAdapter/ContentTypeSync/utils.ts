// Data
import { defaultContentTypesSyncOptions } from "./data";

// Utils

import { Hermes } from "@iliad.dev/hermes";
import prettyBytes from "pretty-bytes";
import deepmerge from "deepmerge";
import fs from "fs";

// Types
import {
  StrictContentTypesSyncOptions,
  ContentTypesSyncOptions,
  ContentTypesResponse,
} from "./types";

function writeContentTypes(
  options: StrictContentTypesSyncOptions,
  data: ContentTypesResponse
): StandardResponse<string> {
  const { outDir, names } = options;
  const [api, components, contentTypes] = data;

  console.log("writing content types");
  try {
    fs.writeFileSync(`${outDir}/${names.contentTypes}`, contentTypes, {
      encoding: "utf8",
    });
    fs.writeFileSync(`${outDir}/${names.components}`, components, {
      encoding: "utf8",
    });
    fs.writeFileSync(`${outDir}/${names.api}`, api, {
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

  const diskSize = prettyBytes(
    data.reduce((acc, curr) => acc + Buffer.byteLength(curr, "utf8"), 0)
  );

  return { data: diskSize, error: undefined };
}

export async function requestNewContentTypes(
  hermes: Hermes
): Promise<StandardResponse<null>> {
  const { data, error } = await hermes.axios.post<string>(
    "/content-types",
    undefined
  );
  if (error !== undefined) {
    console.error("Error requesting new content types", error);
    return { error, data: undefined };
  }

  console.log("New content types requested", data);
  return { data: null, error: undefined };
}

export async function downloadContentTypes(
  hermes: Hermes,
  options: StrictContentTypesSyncOptions,
  start: number = performance.now()
): Promise<StandardResponse<null>> {
  console.log("Downloading content types");
  const { data: $1data, error: $1error } =
    await hermes.axios.get<ContentTypesResponse>("/content-types");
  if ($1error !== undefined) {
    console.error("Error downloading content types", $1error);
    return { error: $1error, data: undefined };
  }

  const { data: diskSize, error: $2error } = writeContentTypes(
    options,
    $1data.data
  );
  if ($2error !== undefined) {
    console.error("Error writing content types", $2error);
    return { error: $2error, data: undefined };
  }

  const ts = (performance.now() - start).toFixed(2);
  console.log(
    `Content types downloaded and written to disk (${diskSize}) in ${ts}ms`
  );

  return { data: null, error: undefined };
}

function shouldBlock(
  options: StrictContentTypesSyncOptions,
  log: boolean = false
): boolean {
  const ctExists = doContentTypesExist(options);
  const _log = log || options.logBlockReasons;
  const blockReasons: string[] = [];

  // Push block reasons to the blockReasons array
  if (options.alwaysBlock) blockReasons.push("alwaysBlock");
  if (options.blockOnFirstDownload && !ctExists)
    blockReasons.push("blockOnFirstDownload");

  if (_log) {
    console.log(
      "Blocking execution until download completes for reasons:",
      blockReasons.join(", ")
    );
  }

  return blockReasons.length > 0;
}

export function downloadContentTypesDynamic(
  hermes: Hermes,
  options: StrictContentTypesSyncOptions
): StandardResponse<null> {
  const start = performance.now();

  // Content types already exist, so we don't need to wait for the download
  downloadContentTypes(hermes, options, start).then(({ data, error }) => {
    if (error !== undefined) {
      console.error("Error downloading content types", error);
      return { error };
    }

    console.log("Content types downloaded asyncronously"); // This is handled by the downloadContentTypes function
  });

  return { data: null, error: undefined };
}

export function doContentTypesExist({
  outDir,
  names,
}: StrictContentTypesSyncOptions): boolean {
  console.log(1);
  if (!fs.existsSync(outDir)) return false;

  const files = fs.readdirSync(outDir);
  console.log(
    files.includes(names.contentTypes),
    files.includes(names.components)
  );
  return files.includes(names.contentTypes) && files.includes(names.components);
}

export function normalizeContentTypesOptions(
  options: ContentTypesSyncOptions
): StrictContentTypesSyncOptions {
  const merged = deepmerge(defaultContentTypesSyncOptions, options);
  return merged as StrictContentTypesSyncOptions; // I'm not spending eighteen hours making this type-safe
}
