import og_deepmerge from "deepmerge";

function deepmerge<T1, T2>(
  x: Partial<T1>,
  y: Partial<T2>,
  options?: deepmerge.Options
) {
  return og_deepmerge<T1, T2>(x, y, options);
}

export { deepmerge };
