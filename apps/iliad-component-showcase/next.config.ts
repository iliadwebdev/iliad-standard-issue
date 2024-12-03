import { withStandardIssue } from "@iliad.dev/standard-issue/meta";
import strapi from "./src/instances/strapi/server/index";
import type { NextConfig } from "next";

const nextConfig = async (): Promise<NextConfig> =>
  withStandardIssue(
    strapi.utils.next.withRedirects({
      /* config options here */
      sassOptions: {
        silenceDeprecations: ["legacy-js-api"],
        api: "modern-compiler",
      },
    })
  );

export default nextConfig;
