import "@iliad.dev/ts-utils/@types";
import "./@types/strapi";

import LegacyStrapiInstance from "./strapiAdapter/StrapiInstance/legacy";
import StrapiInstance from "./strapiAdapter/StrapiInstance";
import StrapiUtils from "./utils/utils";

export { LegacyStrapiInstance, StrapiInstance, StrapiUtils };
export default StrapiInstance;
