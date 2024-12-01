// throw Error('Do not import `thoth.ts` directly. Use `thoth.test.ts` instead.');
import { Thoth } from '@iliad.dev/thoth';
const thoth = new Thoth({
  config: {
    prefix: {
      newLine: false,
      timestamp: {
        components: ['milliseconds', 'time'],
        enabled: true,
      },
    },
  },
});

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const complexObject = {
  a: 1,
  b: '2',
  c: {
    d: 3,
    e: '4',
    f: {
      g: 5,
      h: '6',
    },
  },
  arr: [
    1,
    '2',
    {
      a: 3,
      b: '4',
    },
    '5',
    thoth,
    Thoth,
  ],
};

export async function mainThothTest() {
  // overrideConsole();

  console.log('test1');

  thoth.log('=============================================');
  const lrLog = thoth.$log('Beginning long-running process');
  await sleep(2000);
  subProcess: {
    let _lrLog = lrLog.$log('Subprocess Beginning');
    await sleep(2000);
    let subProcessStepA = _lrLog.$log('Subprocess Step 1A');
    console.log('test2');
    thoth.log('thothtest2');
    let subProcessStepB = _lrLog.$log('Subprocess Step 1B');
    await sleep(500);
    let subProcessStep2 = _lrLog.$log('Subprocess Step 2');
    await sleep(2000);
    subProcessStep2.fail('Subprocess 2 rejected');
    subProcessStepA.succeed('Subprocess 1 resolved');
    subProcessStepB.succeed('Subprocess 1 resolved');
    await sleep(2000);
  }
  lrLog.info('Status update without timer');
  await sleep(2000);

  lrLog.warn('Subprocess step failed');
  lrLog.succeed('Long running process resolved');

  thoth.log(complexObject);
}
