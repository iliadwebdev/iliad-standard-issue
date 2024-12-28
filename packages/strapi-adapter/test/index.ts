import path from "path";
import dotenv from "dotenv";
dotenv.config();

// import { StrapiInstance } from "@iliad.dev/strapi-adapter";
import { StrapiInstance } from "../src";

const strapiApiLocation = process.env.STRAPI_API_URL || "";
const strapiBearerToken = process.env.STRAPI_API_KEY || "";

const typesDir = path.resolve(process.cwd(), "./test/@types");

const strapi = new StrapiInstance({
  strapiApiLocation,
  strapiBearerToken,
  label: "Server Test (Legacy)",
  client: "fetch",
  hermesOptions: {
    verboseLogging: false,
  },
  contentTypesSyncOptions: {
    outDir: typesDir,
  },
});

// strapi.syncContentTypes();

async function getArticlesData(searchParams = {}) {
  const sort = "updatedAt:desc";
  const query = {};
  const page = 1;

  const extraQuery: Record<string, any> = {
    populate: "*",
    sort,
  };

  if (query) {
    extraQuery.filters = {
      title: {
        $containsi: query,
      },
    };
  }

  const { data, error: $1error } = await strapi.getCollection("articles", {
    ...extraQuery,
    pageSize: 11,
    page,
  });

  if ($1error) {
    console.error({
      articles: $1error,
    });
    throw new Error("Failed to fetch articles data");
  }

  const { data: articles = [], meta } = data;

  return { articles, meta };
}

(async () => {
  const { articles, meta } = await getArticlesData();
  console.log({ articles, meta });
})();

// strapi.

export default strapi;
export { strapi };
