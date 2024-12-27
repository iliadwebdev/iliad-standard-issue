import path from "path";
import dotenv from "dotenv";
dotenv.config();

import { StrapiInstance } from "@iliad.dev/strapi-adapter";
// import { StrapiInstance } from "../src";

const strapiApiLocation = process.env.STRAPI_API_URL || "";
const strapiBearerToken = process.env.STRAPI_API_KEY || "";

const typesDir = path.resolve(process.cwd(), "./test/@types");

const strapi = new StrapiInstance({
  strapiApiLocation,
  strapiBearerToken,
  label: "Server Test (Legacy)",
  client: "fetch",
  hermesOptions: {
    verboseLogging: false,
  },
  contentTypesSyncOptions: {
    outDir: typesDir,
  },
});

strapi.syncContentTypes();

strapi.getCollection();

// strapi.

export default strapi;
export { strapi };
