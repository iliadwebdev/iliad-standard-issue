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
    outDir: typesDir,
  });

export const mainStrapiAdapterTest = async () =>
  // await strapi.syncContentTypes();
  // strapi.syncContentTypes({
  //   outDir: typesDir,
  // });

  console.log('Strapi instantiated, running Strapi Adapter Test');

const { data: data2, error: error2 } =
  await strapi.getCollection<'api::article.article'>('articles', 1, 99, {});
console.log(data2.data[0]);
console.log({ data2, error2 });
