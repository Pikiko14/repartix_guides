import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { GuidesService } from './guides.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GuidesController } from './guides.controller';
import { PdfService } from './processor/pdf/pdf.service';
import { NatsModule } from './../transports/nats.module';
import { Guides, GuideSchema } from './schemas/guide.schema';
import { CacheServiceModule } from 'src/commons/cache/cache.module';
import { GuidesRepository } from './repositories/guides.repository';
import { PrintGuideProcessor } from './processor/print-guide.processor';
import { CloudinaryModule } from 'src/commons/cloudinary/cloudinary.module';

@Module({
  imports: [
    NatsModule,
    CloudinaryModule,
    CacheServiceModule,
    BullModule.registerQueue({
      name: 'guides',
    }),
    MongooseModule.forFeature([{ name: Guides.name, schema: GuideSchema }]),
  ],
  controllers: [GuidesController],
  providers: [PrintGuideProcessor, GuidesService, PdfService, GuidesRepository],
})
export class GuidesModule {}
