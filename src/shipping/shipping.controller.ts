import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ShippingService } from './shipping.service';
import { CreateShippingDto } from './dto/create-shipping.dto';

@Controller()
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @MessagePattern('quote-shipping')
  create(@Payload() createShippingDto: CreateShippingDto) {
    return this.shippingService.create(createShippingDto);
  }
}
