import { Module } from '@nestjs/common';
import { createClient } from 'celery-node';
import { AppConfigService } from '../config/appConfig.service';

export const CELERY_CLIENT = 'CELERY_CLIENT';

export type CeleryClient = ReturnType<typeof createClient>;

export enum CeleryClientQueue {
  DEFAULT = 'celery',
  CRAWLER = 'crawler',
}

export class CeleryClientService {
  private clientCache: Partial<Record<CeleryClientQueue, CeleryClient>>;

  constructor(private appConfigService: AppConfigService) {
    this.clientCache = {};
  }

  get(queue: CeleryClientQueue): CeleryClient {
    let redisConnectionStr;
    if (process.env['REDIS_URL']) {
      redisConnectionStr = process.env['REDIS_URL'];
    } else {
      redisConnectionStr = `redis://${process.env['REDIS_HOST']}:${process.env['REDIS_PORT']}`;
    }

    if (this.clientCache[queue] === undefined) {
      this.clientCache[queue] = createClient(
        redisConnectionStr,
        redisConnectionStr,
        queue,
      );
    }
    return this.clientCache[queue];
  }
}

@Module({
  providers: [
    {
      provide: CELERY_CLIENT,
      useFactory: async (appConfig: AppConfigService) => {
        return new CeleryClientService(appConfig);
      },
      inject: [AppConfigService],
    },
  ],
  exports: [CELERY_CLIENT],
})
export class CeleryClientModule {}
