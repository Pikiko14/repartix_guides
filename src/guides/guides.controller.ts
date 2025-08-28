import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GuidesService } from './guides.service';
import { CreateOrderDto } from './dto/create-guide.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';

@Controller()
export class GuidesController {
  constructor(private readonly guidesService: GuidesService) {}

  @MessagePattern('create-guide')
  create(@Payload() createOrderDto: CreateOrderDto | UpdateGuideDto | any) {
    return this.guidesService.create(createOrderDto);
  }

  @MessagePattern('find-guide')
  findOne(@Payload() id: number) {
    return this.guidesService.findOne(id);
  }
}
