import { LoggerService } from '@nestjs/common';
import { IPrismaClient } from './interface/prisma-client.interface';

export function prismaClientConfig(url: string) {
  return {
    datasourceUrl: url,
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'info',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
  };
}

function formatLogFn(e) {
  return {
    // @ts-ignore
    message: e.query,
    // @ts-ignore
    params: e.params,
    // @ts-ignore
    durationMs: `${e.duration}`,
  };
}

export async function initPrismaClient(
  client: IPrismaClient,
  logger: LoggerService,
): Promise<void> {
  try {
    await client.$connect();
  } catch (e) {
    logger.error(e);
  }

  // @ts-ignore
  client.$on('query', (e) => {
    const log = formatLogFn(e);
    logger.debug(log);
  });
  // @ts-ignore
  client.$on('error', (e) => {
    const log = formatLogFn(e);
    logger.error(log);
  });
  // @ts-ignore
  client.$on('warn', (e) => {
    const log = formatLogFn(e);
    logger.warn(log);
  });
  // @ts-ignore
  client.$on('info', (e) => {
    const log = formatLogFn(e);
    logger.log(log);
  });
}
