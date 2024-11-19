function getTimestamp(showDate: boolean = false): string {
  var date = new Date();

  var month: any = date.getMonth() + 1;
  var day: any = date.getDate();
  var hour: any = date.getHours();
  var min: any = date.getMinutes();
  var sec: any = date.getSeconds();

  month = (month < 10 ? '0' : '') + month;
  day = (day < 10 ? '0' : '') + day;
  hour = (hour < 10 ? '0' : '') + hour;
  min = (min < 10 ? '0' : '') + min;
  sec = (sec < 10 ? '0' : '') + sec;

  var str =
    date.getFullYear() +
    '-' +
    month +
    '-' +
    day +
    '_' +
    hour +
    ':' +
    min +
    ':' +
    sec;

  return (showDate ? str : str?.split('_')[1]) || '00:00:00';
}

interface GetFormattedNameOptions {
  targetLength?: number;
  padWith?: string;
  padLeft?: boolean;
  truncate?: boolean;
  truncateWith?: string;
}

function getFormattedName(
  inputString: string,
  options: GetFormattedNameOptions = {}
) {
  let {
    targetLength = 10,
    padWith = ' ',
    padLeft = false,
    truncate = true,
    truncateWith = '...',
  } = options;

  if (inputString.length < targetLength) {
    while (inputString.length < targetLength) {
      inputString = padLeft ? padWith + inputString : inputString + padWith;
    }
  }
  if (truncate && inputString.length > targetLength) {
    inputString = inputString.slice(0, targetLength - 3) + truncateWith;
  }

  return inputString;
}

function padPrefix(prefix: string): string {
  return prefix === '' ? ' ' : `  ${prefix}`;
}

export { getFormattedName, getTimestamp, padPrefix };
