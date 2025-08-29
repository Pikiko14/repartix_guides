// emails/emails.processor.ts
import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
} from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { PdfService } from './pdf/pdf.service';
import { CreateOrderDto } from '../dto/create-guide.dto';

@Processor('guides')
export class PrintGuideProcessor {
  logger = new Logger(PrintGuideProcessor.name);
  constructor(private pdfService: PdfService) {}

  @Process('print')
  async handlerPrint(job: Job<{ order: CreateOrderDto }>) {
    try {
      await this.pdfService.generateOrderPdf(job.data);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.verbose(`Job ${job.id} para la order #${ job.data.reference } está en ejecución...`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: any) {
    this.logger.log(`Job ${job.id} para la order #${ job.data.reference } completado.`);
  }

  @OnQueueFailed()
  onFailed(job: Job<any>, error: any) {
    this.logger.error(`Job ${job.id} para la order #${ job.data.reference } falló con error:`, error);
  }
}
