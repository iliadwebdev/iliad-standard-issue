import { ContextClient } from "@types";
import {
  PopulatedStrapiInstanceParams,
  WarningConfig,
  WarningKeys,
  WarningFn,
} from "../types";
import Options from "@classes/Options";

function warningConfigToBool(key: WarningKeys, config: WarningConfig): boolean {
  if (config === true || config === false) return config;
  return config?.[key] ?? false;
}

function createWarning<Args extends any[]>(
  key: WarningKeys,
  fn: (suppress: boolean, ...args: Args) => void
): WarningFn<Args> {
  return (wConfig: WarningConfig, ...args: Args) => {
    const suppress = warningConfigToBool(key, wConfig);
    fn(suppress, ...args);
  };
}

const warnings = {
  warnIfLegacyPattern: createWarning(
    "suppressLegacyApiWarning",
    function (suppress, apiLocation: string) {
      if (!apiLocation.endsWith("api") || suppress) return;
      console.warn(
        `strapiApiLocation is using a legacy pattern. If you meant to include (/api) in your URL, set the suppressLegacyApiWarning option to true. Api Location: \n`,
        apiLocation
      );
    }
  ),
  warnIfAxios: createWarning(
    "suppressAxiosWarning",
    function (suppress, client: ContextClient) {
      if (client === "fetch" || suppress) return;
      console.warn(
        "Axios is currently not supported. Defaulting to fetch instead."
      );
    }
  ),
  warnIfNormalizeData: createWarning(
    "suppressNormalizeStrapiData",
    function (suppress, options: Options) {
      if (suppress || !options?.normalizeStrapiData) return;
      console.warn(
        "normalizeStrapiData is not yet implemented. Data will be returned in the style of the v4 Strapi API."
      );
    }
  ),
};

export default warnings;
export { warnings };
