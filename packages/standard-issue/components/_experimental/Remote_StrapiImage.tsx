"use server";

// Components
import { StrapiImage } from "../IliadImage";

// Server
import strapi from "@strapi/server";

// Types
import type { APIResponse, APIResponseData } from "iliad-strapi-adapter";
import type { StrapiImageProps } from "../IliadImage";

type FromStrapiServerProps = Partial<StrapiImageProps> & {
  assetId: string | number;
};

console.warn(
  `[Iliad] Remote_StrapiImage: This component is marked as unstable and experimental.`
);

/**
 * @unstable
 * @experimental
 *
 * This component is marked as unstable and experimental.
 * It may change in the future and should be used with caution.
 * Performance characteristics have not been evaluated.
 */
const Remote_StrapiImage = async ({
  assetId,
  ...props
}: FromStrapiServerProps) => {
  const {
    data: asset,
    error,
  }: StandardResponse<{
    // NOTE: TODO: API responses are completely different for media assets 🤦‍♀️
    // No idea what's going on here tbh
    data: APIResponseData<"plugin::upload.file">["attributes"] & { id: number };
  }> = await strapi.hermes.fetch(`/upload/files/${assetId}`, {});

  // console.log(error, asset);

  if (error || !asset) {
    console.error(
      `[Iliad] FromStrapiServer: Error fetching asset with id ${assetId}`,
      error
    );
    return null;
  }

  // Dunno what's going on here tbh
  const mediaAsset = asset as BaseStrapiMediaAsset;

  // @ts-ignore
  return <StrapiImage mediaAsset={mediaAsset} {...props} />;
};

export default Remote_StrapiImage;
export { Remote_StrapiImage };
