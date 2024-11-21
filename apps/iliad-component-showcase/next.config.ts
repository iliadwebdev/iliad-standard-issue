import { withStandardIssue } from "@iliad.dev/standard-issue/meta";
import type { NextConfig } from "next";

const nextConfig: NextConfig = withStandardIssue({
  /* config options here */
  sassOptions: {
    api: "modern-compiler",
  },
});

export default nextConfig;
