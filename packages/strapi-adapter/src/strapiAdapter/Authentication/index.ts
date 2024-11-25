import { FeatureParams } from "../Feature/types";
import Feature from "../Feature";

class Authentication extends Feature {
  constructor(props: FeatureParams) {
    super(props);
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
