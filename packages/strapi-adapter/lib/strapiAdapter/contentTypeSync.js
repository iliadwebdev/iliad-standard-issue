import "../chunk-PKBMQBKP.js";
import prettyBytes from "pretty-bytes";
import deepmerge from "deepmerge";
import fs from "fs";
const defaultContentTypesSyncOptions = {
  blockOnFirstDownload: true,
  requestOnSync: false,
  names: {
    contentTypes: "contentTypes.d.ts",
    components: "components.d.ts"
  }
};
function writeContentTypes(options, data) {
  const { outDir, names } = options;
  const [contentTypes, components] = data;
  try {
    fs.writeFileSync(`${outDir}/${names.contentTypes}`, contentTypes, {
      encoding: "utf8"
    });
    fs.writeFileSync(`${outDir}/${names.components}`, components, {
      encoding: "utf8"
    });
  } catch (error) {
    console.error("Error writing content types", error);
    return {
      data: void 0,
      error: {
        message: "Error writing content types",
        code: 500
      }
    };
  }
  const contentTypesSize = Buffer.byteLength(contentTypes, "utf8");
  const componentsSize = Buffer.byteLength(components, "utf8");
  const diskSize = prettyBytes(contentTypesSize + componentsSize);
  return { data: diskSize, error: void 0 };
}
async function requestNewContentTypes(hermes) {
  const { data, error } = await hermes.axios.post("/content-types");
  if (error !== void 0) {
    console.error("Error requesting new content types", error);
    return { error };
  }
  console.log("New content types requested", data);
  return { data: null };
}
async function downloadContentTypes(hermes, options, start = performance.now()) {
  const { data: $1data, error: $1error } = await hermes.axios.get("/content-types");
  if ($1error !== void 0) {
    console.error("Error downloading content types", $1error);
    return { error: $1error };
  }
  console.log(Object.keys($1data));
  const { data: diskSize, error: $2error } = writeContentTypes(
    options,
    $1data.data
  );
  if ($2error !== void 0) {
    console.error("Error writing content types", $2error);
    return { error: $2error };
  }
  const ts = (performance.now() - start).toFixed(2);
  console.log(
    `Content types downloaded and written to disk (${diskSize}) in ${ts}ms`
  );
  return { data: null };
}
function downloadContentTypesSync(hermes, options) {
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
function doContentTypesExist({
  outDir,
  names
}) {
  if (!fs.existsSync(outDir)) return false;
  const files = fs.readdirSync(outDir);
  return files.includes(names.contentTypes) && files.includes(names.components);
}
function normalizeContentTypesOptions(options) {
  const merged = deepmerge(defaultContentTypesSyncOptions, options);
  return merged;
}
export {
  doContentTypesExist,
  downloadContentTypes,
  downloadContentTypesSync,
  normalizeContentTypesOptions,
  requestNewContentTypes
};
