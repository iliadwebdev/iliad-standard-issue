import { StrapiInstance } from '@iliad.dev/strapi-adapter';
// import { APIResponseData } from '@iliad.dev/strapi-adapter';
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
  // await strapi.findOne('events', 1, {
  //   filters: {
  //     earliestVenueStart: {
  //       $gte: new Date().toISOString(),
  //     },
  //   },
  // });

  // type A = APIResponseData<'api::event.event'>;

  // const a: A = {} as any;

  // @ts-ignore
  const result = await strapi.findOne('events', 1, {
    filters: {
      earliestVenueStart: {
        $gte: '2021-09-01T00:00:00.000Z',
      },
    },
  });

  strapi.findOne('articles-page', 1, {
    filters: {
      featuredArticle: {
        $not: null,
      },
    },
  });

  const { data, error } = await strapi.GET('/events/{id}', {
    params: {
      path: {
        id: 1,
      },
    },
  });

  console.log({ data, error });

  // const { data, error } = await strapi.find('events', {
  //   populate: ['venues', 'coverImage'],
  //   filters: {
  //     earliestVenueStart: {
  //       $gte: new Date().toISOString(),
  //     },
  //   },
  // });
  // console.log({ data, error });
};
