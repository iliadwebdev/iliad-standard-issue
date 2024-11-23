import { overrideConsole } from '@iliad.dev/thoth';

export async function mainThothTest() {
  overrideConsole();

  console.log('Beginning');
}
