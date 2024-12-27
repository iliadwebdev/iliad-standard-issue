// import thoth from "@thoth";

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

function formatContentTypes(contentTypes: string): string {
  return contentTypes;
  return contentTypes
    .replaceAll(`from "@strapi/strapi"`, `from '@iliad.dev/strapi-adapter'`)
    .replaceAll(`from '@strapi/strapi'`, `from '@iliad.dev/strapi-adapter'`);
}

function formatComponents(components: string): string {
  return components;
  return components
    .replaceAll(`from "@strapi/strapi"`, `from '@iliad.dev/strapi-adapter'`)
    .replaceAll(`from '@strapi/strapi'`, `from '@iliad.dev/strapi-adapter'`);
}

function formatApi(api: string): string {
  return api;
}

function writeContentTypes(
  options: StrictContentTypesSyncOptions,
  data: ContentTypesResponse
): StandardResponse<string> {
  const { outDir, names } = options;
  const [api, components, contentTypes] = data;

  // thoth.log("writing content types");
  const enc: any = {
    encoding: "utf8",
  };

  try {
    if (!fs.existsSync(outDir)) {
      console.warn(
        `[WARN] strapi-adapter: Directory ${outDir} does not exist. Creating...`
      );
      fs.mkdirSync(outDir);
    }

    if (!contentTypes) throw new Error("Content types not found");
    const _contentTypes = formatContentTypes(contentTypes);
    fs.writeFileSync(`${outDir}/${names.contentTypes}`, _contentTypes, enc);

    if (!components) throw new Error("Components not found");
    const _components = formatComponents(components);
    fs.writeFileSync(`${outDir}/${names.components}`, _components, enc);

    if (!api) throw new Error("API not found");
    const _api = formatApi(api);
    fs.writeFileSync(`${outDir}/${names.api}`, _api, enc);
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
  hermes: Hermes,
  endpoint: string
): Promise<StandardResponse<null>> {
  // const msg = thoth.$log("Requesting new content types...");

  const { data, error } = await hermes.axios.post<string>(endpoint, undefined);
  if (error !== undefined) {
    // msg.fail("Error requesting new content types").error(error);
    return { error, data: undefined };
  }

  // msg.succeed("New content types requested").debug(data);
  return { data: null, error: undefined };
}

export async function downloadContentTypes(
  hermes: Hermes,
  options: StrictContentTypesSyncOptions,
  endpoint: string,
  start: number = performance.now()
): Promise<StandardResponse<null>> {
  // const msg = thoth.$log("Downloading content types...");

  const { data: $1data, error: $1error } =
    await hermes.axios.get<ContentTypesResponse>(endpoint);

  if ($1error !== undefined) {
    // msg.fail("Error downloading content types");
    // msg._error($1error);
    return { error: $1error, data: undefined };
  }

  const { data: diskSize, error: $2error } = writeContentTypes(
    options,
    $1data.data
  );
  if ($2error !== undefined) {
    // msg.fail("Error writing content types");
    // msg._error($2error);

    return { error: $2error, data: undefined };
  }

  const ts = (performance.now() - start).toFixed(2);
  console.log(
    `Content types downloaded and written to disk (${diskSize}) in ${ts}ms`
  );

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
