import StrapiInstance from "../StrapiInstance";

class Utility {
  protected strapiInstance: StrapiInstance;
  constructor(strapiInstance: StrapiInstance) {
    this.strapiInstance = strapiInstance;
  }
}

export default Utility;
export { Utility };
