import { IConfig } from '../../../config/interface/config.interface';
import WinstonLokiTransport = require('winston-loki');
import { MSG_ALIAS, notMeta } from '../const/log.const';

export class LokiTransport extends WinstonLokiTransport {
  constructor(config: IConfig) {
    const { loki: lokiConfig } = config.log;
    const host = `${lokiConfig.protocol}://${lokiConfig.host}:${lokiConfig.port}`;
    super({
      level: lokiConfig.level.toString(),
      host,
      onConnectionError: (error: unknown) => {
        console.log(error);
      },
    });
  }

  log(info, callback) {
    const msg = info[MSG_ALIAS];
    delete info[MSG_ALIAS];
    const logInfo = { message: msg };
    const meta: Record<string, any> = {};
    Object.entries(info).forEach(([k, v]) => {
      if (typeof v === 'object' || notMeta(k)) {
        logInfo[k] = v;
        return;
      }
      meta[k] = v;
    });
    logInfo['labels'] = meta;

    super.log(logInfo, callback);
  }
}
