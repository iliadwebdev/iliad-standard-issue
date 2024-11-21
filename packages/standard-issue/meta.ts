export default withStandardIssue; // Next.js freaks out if this isn't exported in its own file.
export function withStandardIssue(config) {
  return {
    ...config,
    transpilePackages: (config?.transpilePackages ?? []).concat([
      "@iliad.dev/standard-issue",
    ]),
  };
}
