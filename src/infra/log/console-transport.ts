import { transports, format } from 'winston';
import { IConfig } from '../../config/interface/config.interface';
import { LOG_COLORS } from './enum/log-level.enum';

export class ConsoleTransport extends transports.Console {
  constructor(config: IConfig) {
    super({
      level: config.log.console.level.toString(),
      format: format.combine(
        format.colorize({ colors: LOG_COLORS }),
        format.timestamp({
          format: (): string => {
            return `${config.tz} ${new Date().toLocaleString('GMT', { timeZone: config.tz, hour12: false })}`;
          },
        }),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        }),
      ),
    });
  }
}
