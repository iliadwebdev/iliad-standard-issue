import { CTUID, CrudQueryCreate, CrudQueryFind } from "./types";

export async function restOperation() {}

export async function crudOperation() {}

export function normalizeUrl(url: string | URL) {
  return url.toString();
}
type CrudQuery<T extends CTUID> = CrudQueryFind<T> | CrudQueryCreate<T>;
// This takes the params options and formats it properly for strapi to understand
export function normalizeParams<T extends CTUID>(
  params: CrudQuery<CTUID>
): Partial<RequestInit> {
  return {
    body: JSON.stringify(params),
  };
}
