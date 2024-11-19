import { mainHermesTest, mainStrapiAdapterTest } from './testing';

(async () => {
  console.log('running');
  await mainHermesTest();
  await mainStrapiAdapterTest();
})();
