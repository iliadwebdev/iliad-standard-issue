import path from "path";

import { StrapiInstance } from "@iliad.dev/strapi-adapter";

const strapiApiLocation = process.env.STRAPI_API_URL || "";
const strapiBearerToken = process.env.STRAPI_API_KEY || "";

const typesDir = path.resolve(process.cwd(), "./src/@types");

const strapi = new StrapiInstance({
  strapiApiLocation,
  strapiBearerToken,
  label: "Server Test (Legacy)",
  client: "fetch",
  hermesOptions: {
    verboseLogging: false,
  },
  contentTypesSyncOptions: {
    requestOnSync: true,
    outDir: typesDir,
  },
});

strapi.syncContentTypes();

export default strapi;
export { strapi };
