import { Hermes } from '@iliad.dev/hermes';
const hermes = new Hermes({});
export const mainHermesTest = async () => {
  console.log('running Hermes Test');

  hermes.addBaseUrl('https://catfact.ninja/fact');

  const { data, error } = await hermes.fetch('');

  console.log({
    error,
    data,
  });
};
