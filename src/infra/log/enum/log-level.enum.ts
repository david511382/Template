export enum LogLevelEnum {
  Fatal = 0,
  Error = 1,
  Warn = 2,
  Info = 3,
  Debug = 4,
}

export enum LogLevelNameEnum {
  Fatal = 'fatal',
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
}

const enums = Object.values(LogLevelEnum);
const nameEnums = Object.values(LogLevelNameEnum);

export const LEVELS = initLevels();

function initLevels(): Record<string, number> {
  const res = {};

  const len = nameEnums.length;
  for (let i = 0; i < len; i++) {
    const k = nameEnums[i];
    const v = enums[i + len];
    res[k] = v;
  }

  return res;
}

export const LOG_COLORS: Record<string, string> = initLogColors();

function initLogColors(): Record<string, string> {
  const res = {};

  res[LogLevelNameEnum.Fatal] = 'red';

  return res;
}
