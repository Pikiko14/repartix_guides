import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { GuidesService } from './guides.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GuidesController } from './guides.controller';
import { PdfService } from './processor/pdf/pdf.service';
import { NatsModule } from './../transports/nats.module';
import { Guides, GuideSchema } from './schemas/guide.schema';
import { GuidesRepository } from './repositories/guides.repository';
import { PrintGuideProcessor } from './processor/print-guide.processor';
import { CloudinaryModule } from 'src/commons/cloudinary/cloudinary.module';

@Module({
  imports: [
    NatsModule,
    MongooseModule.forFeature([{ name: Guides.name, schema: GuideSchema }]),
    BullModule.registerQueue({
      name: 'guides',
    }),
    CloudinaryModule,
  ],
  controllers: [GuidesController],
  providers: [PrintGuideProcessor, GuidesService, PdfService, GuidesRepository],
})
export class GuidesModule {}
