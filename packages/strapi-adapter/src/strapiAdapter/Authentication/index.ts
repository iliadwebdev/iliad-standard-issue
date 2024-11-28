import { FeatureParams } from "../Feature/types";
import Feature from "../Feature";
import Options from "@classes/Options";

class Authentication extends Feature {
  constructor(options: Options) {
    super(options);
  }

  auth(): ErrorResponse {
    return {
      data: undefined,
      error: { message: "Not implemented", code: 500 },
    };
  }
}

export default Authentication;
export { Authentication };
// export * from "./types";
