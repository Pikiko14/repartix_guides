import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { GetGuideDto } from './dto/get-guide.dto';
import { CreateOrderDto } from './dto/create-guide.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { GuidesRepository } from './repositories/guides.repository';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class GuidesService {
  constructor(
    @InjectQueue('guides') private guidesQueue: Queue,
    @Inject() private readonly repository: GuidesRepository,
  ) {}

  async create(createOrderDto: CreateOrderDto | UpdateGuideDto | any) {
    await this.guidesQueue.add('print', createOrderDto);
    return true;
  }

  async findOne(getGuideDto: GetGuideDto) {
    try {
      const guide = await this.repository.find(
        getGuideDto.reference,
        getGuideDto.parent_id,
      );

      if (!guide)
        throw new RpcException({
          message: `Guide with this reference: ${getGuideDto.reference} not found`,
          status: HttpStatus.NOT_FOUND,
          error: true,
        });

      return {
        success: true,
        data: guide,
        message: 'Guide information',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
