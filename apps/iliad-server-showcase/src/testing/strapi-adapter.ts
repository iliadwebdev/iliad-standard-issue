import { StrapiInstance } from '@iliad.dev/strapi-adapter';
import { Thoth } from '@iliad.dev/thoth';
import { config } from 'dotenv';
import path from 'path';
config();

const thoth = new Thoth({
  config: {
    prefix: {
      namespace: {
        name: '[II-SA]',
        color: '#4945FF',
        enabled: true,
      },
      newLine: false,
      timestamp: {
        components: ['time'],
        enabled: true,
      },
      module: {
        enabled: false,
      },
    },
  },
});

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
    outDir: typesDir,
  },
});

await strapi.syncContentTypes();

export const mainStrapiAdapterTest = async () => {
  const { data: event, error } = await strapi.getFullCollection('events', {
    populate: {
      funders: true,
    },
  });

  console.error({ event, error });
};
