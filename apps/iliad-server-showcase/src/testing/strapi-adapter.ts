import StrapiContext from '@iliad.dev/strapi-adapter';
import { config } from 'dotenv';
import path from 'path';
config();

const strapiApiLocation = process.env.STRAPI_API_URL || '';
const strapiBearerToken = process.env.STRAPI_API_KEY || '';
const typesDir = path.resolve(process.cwd(), './src/@types');

// console.log('strapiApiLocation:', strapiApiLocation);
// console.log('strapiBearerToken:', strapiBearerToken);

const strapi = new StrapiContext(
  `${strapiApiLocation}/api`,
  strapiBearerToken,
  'fetch',
  {
    verboseLogging: false,
  },
)
  .label('Server Test')
  .withContentTypes({
    outDir: typesDir,
  });

await strapi.syncContentTypes();

export const mainStrapiAdapterTest = async () => {
  console.log('running Strapi Adapter Test');
};
