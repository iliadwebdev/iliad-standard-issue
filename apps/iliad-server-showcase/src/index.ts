import { mainStrapiAdapterTest, mainThothTest } from './testing';

(async () => {
  // console.log(process.cwd());
  // console.log(process.env);

  console.log('running');
  // await mainHermesTest();
  // await mainThothTest();
  await mainStrapiAdapterTest();
})();
