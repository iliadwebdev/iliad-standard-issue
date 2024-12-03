import CLI from 'clui';
const Spinner = CLI.Spinner;
var countdown1 = new Spinner('1) Exiting in 10 seconds...  ', [
  '⣾',
  '⣽',
  '⣻',
  '⢿',
  '⡿',
  '⣟',
  '⣯',
  '⣷',
]);
var countdown2 = new Spinner('2) Exiting in 10 seconds...  ', [
  '⣾',
  '⣽',
  '⣻',
  '⢿',
  '⡿',
  '⣟',
  '⣯',
  '⣷',
]);

(async () => {
  countdown1.start();
  //   countdown2.start();
  setTimeout(() => {
    countdown1.stop();
    countdown2.start();
  }, 1000);
})();
