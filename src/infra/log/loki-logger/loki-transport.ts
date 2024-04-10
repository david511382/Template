import * as Transport from 'winston-transport';
import { HttpService } from '@nestjs/axios';
import { Agent } from 'https';
import { firstValueFrom, map, catchError, of } from 'rxjs';
import { LokiDto } from './dto/loki.dto';
import { AxiosError } from 'axios';

const TIMESTAMP_ALIAS = 'timestamp';
const MSG_ALIAS = 'message';

export class LokiTransport extends Transport {
  constructor(private readonly _httpService: HttpService, opts) {
    super(opts);
  }

  log(info, callback) {
    try {
      const ts = info[TIMESTAMP_ALIAS];
      delete info[TIMESTAMP_ALIAS];

      const msg = info[MSG_ALIAS];
      delete info[MSG_ALIAS];

      const firewallConfig = {
        protocol: 'http',
        port: 3100,
      }
      const host = 'localhost';
      const url = `${firewallConfig.protocol}://${host}:${firewallConfig.port}/loki/api/v1/push`;
      const method = 'post';
      const meta: Record<string, any> = {};
      Object.entries(info).forEach(([k, v]) => {
        meta[k] = v;
      })
      const data: LokiDto = {
        streams: [
          {
            stream: meta,
            values: [[
              ts,
              msg,
            ]
            ]
          }
        ],
      }
      const headers = {
      };
      const httpsAgent = new Agent({
        rejectUnauthorized: false,
        timeout: 5 * 1000,
      });
      new Promise(async () => {
        await firstValueFrom(
          this._httpService
            .request({
              method,
              data,
              headers,
              url,
              httpsAgent,
            })
            .pipe(
              map((res) => {
              }),
              catchError(error => {
                const err = error as AxiosError;
                this.errHandler(err.response);
                return of();
              })
            ),
        );
      })
    } catch (err) {
      this.errHandler(err);
    }

    callback();
  }

  private errHandler(err) {
    console.log(err);
  }
};
