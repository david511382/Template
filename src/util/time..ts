import * as moment from 'moment-timezone';

export function toDate(date: Date): Date {
  return date ? toMoment(date).startOf('date').toDate() : date;
}

export function toMoment(date: Date): moment.Moment {
  return date ? moment(date) : undefined;
}
