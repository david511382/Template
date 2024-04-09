import { Expose } from 'class-transformer';

export class FindResVo {
  @Expose({})
  name: string;

  @Expose({ name: 'cron_time' })
  cronTime: string;

  @Expose({})
  running: boolean;

  @Expose({ name: 'last_execution' })
  lastExecution: Date | undefined;

  @Expose({ name: 'run_once' })
  runOnce: boolean;

  constructor(partial?: Partial<FindResVo>) {
    if (partial) Object.assign(this, partial);
  }
}
