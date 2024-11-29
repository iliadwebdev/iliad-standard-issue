import { overrideConsole, Thoth } from '@iliad.dev/thoth';
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
// @ts-ignore
// globalThis.console = a;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mainThothTest() {
  // overrideConsole();

  thoth.log('Beginning');

  const lrLog = thoth.$log('Beginning long-running process');
  sleep(2000);
  subProcess: {
    let _lrLog = lrLog.$log('Subprocess 1');
    sleep(2000);
    let subProcessStep = _lrLog.$log('Subprocess Step 1');
    sleep(500);
    let subProcessStep2 = _lrLog.$log('Subprocess Step 2');
    sleep(2000);
    subProcessStep2.reject('Subprocess 2 rejected');
    subProcessStep.resolve('Subprocess 1 resolved');
    sleep(2000);
  }
  lrLog.info('Status update without timer');
  sleep(2000);

  lrLog.warn('Subprocess step failed');
  lrLog.resolve('Long running process resolved');
}
