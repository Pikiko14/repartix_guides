import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { GetGuideDto } from './dto/get-guide.dto';
import { CreateOrderDto } from './dto/create-guide.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { GuidesRepository } from './repositories/guides.repository';
import { RpcException } from '@nestjs/microservices';
import { CacheService } from 'src/commons/cache/cache.service';

@Injectable()
export class GuidesService {
  constructor(
    @Inject() private readonly cache: CacheService,
    @InjectQueue('guides') private guidesQueue: Queue,
    @Inject() private readonly repository: GuidesRepository,
  ) {}

  async create(createOrderDto: CreateOrderDto | UpdateGuideDto | any) {
    if (!createOrderDto?.products) return;

    await this.guidesQueue.add('print', createOrderDto);
    return true;
  }

  async findOne(getGuideDto: GetGuideDto) {
    try {
      // get from cache
      const cacheKey = `guide:data:${JSON.stringify(getGuideDto)}`;
      let guide = await this.cache.getItem(cacheKey);

      if (guide) {
        return {
          success: true,
          data: guide,
          message: 'Guide information (from cache)',
        };
      }

      guide = await this.repository.find(
        getGuideDto.reference,
        getGuideDto.parent_id,
      );

      if (!guide)
        throw new RpcException({
          message: `Guide with this reference: ${getGuideDto.reference} not found`,
          status: HttpStatus.NOT_FOUND,
          error: true,
        });

      // set in cache
      await this.cache.setItem(cacheKey, guide);

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
