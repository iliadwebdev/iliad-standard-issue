// import thoth from "@thoth";
// Types
import type { Redirect } from "next/dist/lib/load-custom-routes";

// Classes
import StrapiInstance from "src/strapiAdapter/StrapiInstance";

export async function fetchRedirects(
  strapiInstance: StrapiInstance
): Promise<Redirect[]> {
  //   const log = thoth.$log("Fetching redirects from Strapi instance...");
  //   const start = log.timestamp();

  const { data, error } = await strapiInstance.GET("/redirects");
  // @ts-ignore

  if (error || !data?.redirects) {
    // Handle the error as needed, here we return an empty array
    // log.fail("Error fetching redirects:").error(error);
    return [];
  }

  // @ts-ignore
  const response = data?.redirects as Redirect[];
  //   const end = start.timeElapsedFormatted;
  //   log.succeed(`Fetched redirects in ${end}`).debug(data);

  // Ensure data is in the correct format (array of Redirect objects)
  // Adjust this based on the actual structure of 'data'
  //   @ts-ignore
  return response || [];
}
