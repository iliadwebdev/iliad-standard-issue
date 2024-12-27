// import "@iliad.dev/ts-utils/@types";
import "./@types/strapi";

import StrapiInstance from "./strapiAdapter/StrapiInstance";
import StrapiUtils from "./utils/utils";

export { StrapiInstance, StrapiUtils };
export default StrapiInstance;

// Export types
export { Schema, Attribute } from "./@types/strapi";
