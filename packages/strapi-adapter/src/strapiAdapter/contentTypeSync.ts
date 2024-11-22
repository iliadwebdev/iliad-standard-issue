import { ContentTypesSyncOptions } from "../strapiAdapter/strapiAdapter";
import { Hermes } from "@iliad.dev/hermes";

export async function downloadContentTypes(
  hermes: Hermes,
  { outDir }: ContentTypesSyncOptions
): Promise<StandardResponse<string[]>> {
  console.log("Downloading content types");

  return await hermes.axios.get<string[]>("/content-types", undefined);
}
