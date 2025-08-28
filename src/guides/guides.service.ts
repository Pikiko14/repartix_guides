import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-guide.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';

@Injectable()
export class GuidesService {

  constructor(
    @InjectQueue('guides') private guidesQueue: Queue
  ) {}

  async create(createOrderDto: CreateOrderDto | UpdateGuideDto | any) {
    await this.guidesQueue.add('print', createOrderDto);
    return true;
  }

  findOne(id: number) {
    return `This action returns a #${id} guide`;
  }
}
