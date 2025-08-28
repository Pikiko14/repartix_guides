import { Controller } from '@nestjs/common';
import { GuidesService } from './guides.service';
import { GetGuideDto } from './dto/get-guide.dto';
import { CreateOrderDto } from './dto/create-guide.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
@Controller()
export class GuidesController {
  constructor(private readonly guidesService: GuidesService) {}

  @MessagePattern('create-guide')
  create(@Payload() createOrderDto: CreateOrderDto | UpdateGuideDto | any) {
    return this.guidesService.create(createOrderDto);
  }

  @MessagePattern('find-guide')
  findOne(@Payload() getGuideDto: GetGuideDto) {
    return this.guidesService.findOne(getGuideDto);
  }
}
