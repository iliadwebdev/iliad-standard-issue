// // import { Hermes } from '../src/index
// const StrapiContext = require('../dist/index.js').default;
// import { StandardResponse } from '../src/@types/adapter';

// const strapiBearerToken =
//   '59559bb906d1a15cb2a821481c7ee4ae5adf11f4a7c3b4940cbcb6c58b9e5b5e11273954b8582645be5639d848837465a87ee2b7f1dc318fd39893904fafb586bed8d19bb5dfa27b9fb5b7dfbeda94ebd0a94e533f513af8d469059012e3e09ba746aa7cc2c53dbe53de5358877848532a2fc1bd011ed8cfd28e19080cf203c1';
// const strapiApiLocation = 'http://127.0.0.1:1776';

// let _strapi;

// _strapi = new StrapiContext(
//   'Server',
//   `${strapiApiLocation}/api`,
//   strapiBearerToken,
//   'fetch'
// );

// (async () => {
//   const { data, error }: StandardResponse = await _strapi.getEntry(
//     'menus',
//     1,
//     'populate=*'
//   );

//   console.log({
//     data,
//     error,
//   });
// })();
