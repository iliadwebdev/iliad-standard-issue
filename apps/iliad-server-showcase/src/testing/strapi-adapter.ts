import { StrapiInstance } from '@iliad.dev/strapi-adapter';
import { config } from 'dotenv';
import path from 'path';
config();

const strapiApiLocation = process.env.STRAPI_API_URL || '';
const strapiBearerToken = process.env.STRAPI_API_KEY || '';
const typesDir = path.resolve(process.cwd(), './src/@types');

// console.log('strapiApiLocation:', strapiApiLocation);
// console.log('strapiBearerToken:', strapiBearerToken);

console.log('Beginning');
const strapi = new StrapiInstance({
  strapiApiLocation: `${strapiApiLocation}/api`,
  strapiBearerToken: strapiBearerToken,
  client: 'fetch',
  hermesOptions: {
    verboseLogging: false,
  },
})
  .label('Server Test')
  .withContentTypes({
    alwaysBlock: true,
    outDir: typesDir,
  });

export const mainStrapiAdapterTest = async () => {
  console.log('Strapi instantiated, running Strapi Adapter Test');
  const { data, error } = await strapi.getCollection<'api::event.event'>(
    'events',
    1,
    99,
    {
      sort: 'earliestVenueStart:asc',
      filters: {
        earliestVenueStart: { $gte: new Date().toISOString() },
      },
      populate: 'venues',
    },
  );

  await strapi.getCollection<'api::event.event'>('events', 1, 99, {
    populate: ['venues', 'venues.buttons'],
    sort: 'earliestVenueStart:asc',
  });

  console.log({ data, error });
};
