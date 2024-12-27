import { StrapiInstance } from '@iliad.dev/strapi-adapter';
import { Common } from '@iliad.dev/strapi-adapter/esm/@types';

import { config } from 'dotenv';
import path from 'path';
config();

// This is where types will be stored. Is there a way I can move this cache
// to the node_module itself? Is that even desirable?
const typesDir = path.resolve(process.cwd(), './src/@types');

// Instantiate a new StrapiInstance
const strapi = new StrapiInstance({
  strapiApiLocation: process.env.STRAPI_API_URL,
  strapiBearerToken: process.env.STRAPI_API_KEY,
  label: 'Server Test (Legacy)',
  client: 'fetch',
  hermesOptions: {
    verboseLogging: false,
  },
  contentTypesSyncOptions: {
    requestOnSync: true,
    outDir: typesDir,
  },
});

// strapi.syncContentTypes();

export const mainStrapiAdapterTest = async () => {
  // strapi.getCollection("events", {
  // "",
  // });
  // strapi.GET("/articles/{id}")
  // strapi.getEntryBySlug("")
  // https://localhost:1337/api/articles?filters%5BcreatedAt%5D%5B%24lte%5D=2024-12-05T04%3A23%3A02.083Z&populate%5Bimage%5D%5Bfilters%5D%5Bcaption%5D%5B%24notNull%5D=true&pagination%5BpageSize%5D=25&pagination%5Bpage%5D=1
  // const { data: event, error } = await strapi.getFullCollection('events', {
  //   populate: {
  //     funders: true,
  //   },
  // });
  // console.error({ event, error });
};
