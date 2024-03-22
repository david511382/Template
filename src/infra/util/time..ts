const moment = require('moment-timezone');

export function toDate(date: Date): Date {
  return new Date(moment(date).startOf('day'));
}
