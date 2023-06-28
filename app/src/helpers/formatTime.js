// get timezone and utc offset
const _date = new Date();
const TZ = _date
  .toLocaleString("en-US", { timeZoneName: "short" })
  .split(" ")
  .pop();
const OFFSET = _date.getTimezoneOffset();

export const formatDatetime = (x) => {
  const y = new Date(x); // this is in UTC time
  y.setMinutes(y.getMinutes() - OFFSET); // convert from UTC to local time

  // print date in ISO-8601 format with " " as separator and in local timezone
  // const year = y.getFullYear();
  // const month = ('0' + (y.getMonth() + 1)).slice(-2); // add leading zero if necessary
  // const day = ('0' + y.getDate()).slice(-2); // add leading zero if necessary
  // const hour = ('0' + y.getHours()).slice(-2); // add leading zero if necessary
  // const minute = ('0' + y.getMinutes()).slice(-2); // add leading zero if necessary
  // const second = ('0' + y.getSeconds()).slice(-2); // add leading zero if necessary

  // return `${year}-${month}-${day} ${hour}:${minute}:${second} ${TZ}`;

  // return date in local format
  return `${y.toLocaleString()} ${TZ}`;
};
