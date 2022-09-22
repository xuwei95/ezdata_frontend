/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
const DATE_FORMAT = 'YYYY-MM-DD ';

//TODO dayjs.ConfigType不知是否用对
export function formatToDateTime(date: dayjs.ConfigType = undefined, format = DATE_TIME_FORMAT): string {
  return dayjs(date).format(format);
}

export function formatToDate(date:  dayjs.ConfigType = undefined, format = DATE_FORMAT): string {
  return dayjs(date).format(format);
}

export const dateUtil = dayjs;
