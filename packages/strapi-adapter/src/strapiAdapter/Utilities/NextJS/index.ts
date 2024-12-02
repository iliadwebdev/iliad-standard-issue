import StrapiInstance from "src/strapiAdapter/StrapiInstance";
import Utility from "..";

class NextUtils extends Utility {
  constructor(strapiInstance: StrapiInstance) {
    super(strapiInstance);
  }

  public withRedirects(nextConfig) {}
}

export default NextUtils;
export { NextUtils };
