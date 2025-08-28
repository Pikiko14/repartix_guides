// commons/commons.module.ts
import { BullModule } from '@nestjs/bull';
import { envs } from '../../configuration';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: envs.redis_host,
        port: envs.redis_port,
      },
    }),
  ],
  exports: [BullModule],
})
export class QueuesModule {}
