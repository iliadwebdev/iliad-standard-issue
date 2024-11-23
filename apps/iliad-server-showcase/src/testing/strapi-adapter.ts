import {
  StrapiInstance,
  LegacyStrapiInstance,
} from '@iliad.dev/strapi-adapter';
import { config } from 'dotenv';
import path from 'path';
config();

const strapiApiLocation = process.env.STRAPI_API_URL || '';
const strapiBearerToken = process.env.STRAPI_API_KEY || '';
const typesDir = path.resolve(process.cwd(), './src/@types');

console.log('Beginning');
const legacyStrapi = new LegacyStrapiInstance({
  strapiApiLocation: `${strapiApiLocation}/api`,
  strapiBearerToken: strapiBearerToken,
  client: 'fetch',
  hermesOptions: {
    verboseLogging: false,
  },
})
  .label('Server Test (Legacy)')
  .withContentTypes({
    outDir: typesDir,
  });

const strapi = new StrapiInstance({
  strapiApiLocation: `${strapiApiLocation}`,
  strapiBearerToken: strapiBearerToken,
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
  console.log('Strapi instantiated, running Strapi Adapter Test');
  const { data, error } = strapi.getCollection();

  console.log('Data:', data);
};
// await strapi.syncContentTypes();
// strapi.syncContentTypes({
//   outDir: typesDir,
// });
