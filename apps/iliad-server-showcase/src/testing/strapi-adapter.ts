import StrapiContext from '@iliad.dev/strapi-adapter';

const strapiApiLocation = process.env.STRAPI_API_URL || '';
const strapiBearerToken = process.env.STRAPI_API_KEY || '';

const strapi: StrapiContext = new StrapiContext(
  'Server',
  `${strapiApiLocation}/api`,
  strapiBearerToken,
  'fetch',
  {
    verboseLogging: false,
  },
).withContentTypes({
  ourDir: 'src/@types',
});
export const mainStrapiAdapterTest = async () => {
  console.log('running Strapi Adapter Test');
};
