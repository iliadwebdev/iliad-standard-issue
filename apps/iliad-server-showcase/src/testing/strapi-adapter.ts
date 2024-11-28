import { StrapiInstance } from '@iliad.dev/strapi-adapter';
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
  normalizeStrapiResponse: true,
  client: 'fetch',
  hermesOptions: {
    verboseLogging: false,
  },
})
  .label('Server Test (Legacy)')
  .withContentTypes({
    outDir: typesDir,
  });

export const mainStrapiAdapterTest = async () => {
  const result = await strapi.findOne('events', 1, {
    filters: {
      earliestVenueStart: {
        $gte: '2021-09-01T00:00:00.000Z',
      },
    },
  });

  const { data: test, error: e2 } = await strapi.GET('/articles/{id}', {
    params: {
      path: {
        id: 1,
      },
    },
  });

  console.log({ test: test.data, e2, data: test });
};
