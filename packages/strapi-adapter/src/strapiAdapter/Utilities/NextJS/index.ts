// Classes
import StrapiInstance from "src/strapiAdapter/StrapiInstance";
import Utility from "../Utility";

// Types
import type { Redirect } from "next/dist/lib/load-custom-routes";
import type { NextConfig } from "next";

// Utils
import { fetchRedirects } from "./utils";

// Redirects function
type rFN = () => Promise<Redirect[]>;
const dFn: rFN = async () => [];

const typeToPermenant: Record<string, boolean> = {
  found_302: false,
  moved_permanently_301: true,
  temporary_redirect_307: false,
  gone_410: true,
  unavailable_for_legal_reasons_451: true,
};

/**
 * Utility class for integrating Strapi with Next.js configurations.
 *
 * @class NextUtils
 * @extends {Utility}
 *
 * @param {StrapiInstance} strapiInstance - The instance of Strapi to be used.
 */

class NextUtils extends Utility {
  constructor(strapiInstance: StrapiInstance) {
    super(strapiInstance);
  }

  public test(nextConfig: NextConfig): NextConfig {
    return nextConfig;
  }

  /**
   * Returns a function that resolves to an array of redirects.
   * @method getRedirects
   * @param {rFN} [fn=dFn] - A function that returns a promise resolving to an array of redirects.
   * @returns {() => Promise<Redirect[]>} - Returns a function that resolves to an array of redirects.
   */
  public getRedirects(fn: rFN = dFn): Promise<Redirect[]> {
    return Promise.all([fetchRedirects(this.strapiInstance), fn()])
      .then((r) => r.flat())
      .then((r) => {
        return r.map((redirect: any) => {
          // console.log({ redirect });
          return {
            permanent: typeToPermenant[redirect.type],
            destination: redirect.to,
            source: redirect.from,
          } as Redirect;
        });
      });
  }

  /**
   * Integrates redirects into the provided Next.js configuration object.
   * @method withRedirects
   * @param {NextConfig} nextConfig - The Next.js configuration object.
   * @returns {NextConfig} - Returns the Next.js configuration object with redirects integrated.
   */
  public withRedirects(nextConfig: NextConfig): NextConfig {
    const previousRedirects =
      nextConfig.redirects || (() => Promise.resolve([]));
    nextConfig.redirects = () => this.getRedirects(previousRedirects);
    return nextConfig;
  }
}

export default NextUtils;
export { NextUtils };
