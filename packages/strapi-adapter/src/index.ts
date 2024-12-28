// import "@iliad.dev/ts-utils/@types";
import "./@types/strapi";

import StrapiInstance from "./strapiAdapter/StrapiInstance";
import StrapiUtils from "./utils/utils";

export { StrapiInstance, StrapiUtils };
export default StrapiInstance;

// Export types
export type {
  Schema,
  Attribute,
  // These will be helpful to allow the user to create content types
  APIResponseCollectionMetadata,
  APIResponseCollection,
  APIResponseData,
  APIResponse,
  Common,
} from "./@types/strapi";
