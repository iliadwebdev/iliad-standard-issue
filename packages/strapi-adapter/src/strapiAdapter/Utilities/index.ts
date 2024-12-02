import StrapiInstance from "../StrapiInstance";

class Utility {
  protected strapiInstance: StrapiInstance;
  constructor(strapiInstance: StrapiInstance) {
    this.strapiInstance = strapiInstance;
  }
}

export * from "./NextJS";
export default Utility;
export { Utility };
