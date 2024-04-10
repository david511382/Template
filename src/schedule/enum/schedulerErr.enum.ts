export enum SchedulerErrEnum {
  NotFound = 'No Cron Job was found',
  PastDate = 'Date in past. Will never be fired',
  Exists = 'already exists',
}
