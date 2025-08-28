import { envs } from './configuration';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuidesModule } from './guides/guides.module';
import { ShippingModule } from './shipping/shipping.module';
import { CacheServiceModule } from './commons/cache/cache.module';
import { QueuesModule } from './commons/queues/queues.module';

@Module({
  imports: [
    QueuesModule,
    GuidesModule,
    CacheServiceModule,
    MongooseModule.forRoot(envs.app_env === 'production' ?  envs.atlas_url : envs.db_url,),
    ShippingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
