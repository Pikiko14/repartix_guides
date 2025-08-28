import { Module } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { ShippingController } from './shipping.controller';
import { CacheServiceModule } from 'src/commons/cache/cache.module';

@Module({
  imports: [CacheServiceModule],
  controllers: [ShippingController],
  providers: [ShippingService],
})
export class ShippingModule {}
