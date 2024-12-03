import { mainThothTest } from './testing/thoth';
// import { mainStrapiAdapterTest } from './testing/strapi-adapter';
// import './testing/clui';

(async () => {
  // console.log(process.cwd());
  // console.log(process.env);
  // console.log('running');
  // await mainHermesTest();
  await mainThothTest();
  // await mainStrapiAdapterTest();
})();
