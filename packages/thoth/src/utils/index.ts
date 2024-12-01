export * from "./utils.ts";
export function _(...u: object[]) {
  let _u = {};

  for (let i = 0; i < u.length; i++) {
    _u = { ..._u, ...u[i] };
  }

  return _u;
}
