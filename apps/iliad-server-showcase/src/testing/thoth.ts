// throw Error('Do not import `thoth.ts` directly. Use `thoth.test.ts` instead.');
import { Thoth } from '@iliad.dev/thoth';
const thoth = new Thoth({
  config: {
    prefix: {
      newLine: false,
      timestamp: {
        components: ['time'],
        enabled: true,
      },
      module: {
        enabled: false,
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

// throw new Error('break');

export async function mainThothTest() {
  const a = performance.now();

  // overrideConsole();
  console.log('test1');
  thoth.log('test1t');
  thoth.log('test2t');
  thoth.log('test3t');
  thoth.log('=============================================');
  const start = thoth.timestamp();
  const lrLog = thoth.$log('Beginning long-running process');
  await sleep(2000);
  subProcess: {
    let _lrLog = lrLog.$log('Subprocess Beginning');
    await sleep(2000);
    let subProcessStepA = _lrLog.$log('Subprocess Step 1A');
    let subProcessStepB = _lrLog.$log('Subprocess Step 1B');
    await sleep(500);
    _lrLog.$log('Subprocess Step 2');
    let subProcessStep2 = _lrLog.$log('Subprocess Step 3');
    _lrLog.$log('Subprocess Step 4');
    _lrLog.$log('Subprocess Step 5');
    _lrLog.$log('Subprocess Step 6');
    await sleep(2000);
    subProcessStep2.fail('Subprocess 2 rejected');
    subProcessStepA.succeed('Subprocess 1 resolved');
    subProcessStepB.succeed('Subprocess 1 resolved');
    await sleep(2000);
    _lrLog.succeedAll('Subprocess resolved', true);
    await sleep(2000);
  }
  const elapsed = thoth.timestamp(start).timeElapsedFormatted;
  lrLog.info(
    `Long running process has been running for ${thoth.chalk.bold(elapsed)}`,
  );
  await sleep(2000);
  lrLog.warn('Subprocess step failed');
  lrLog.succeed('Long running process resolved');
  await sleep(500);
  lrLog.warn(
    `Long running process has been running for ${thoth.chalk.bold(thoth.timestamp(start).timeElapsedFormatted)}`,
  );
}
